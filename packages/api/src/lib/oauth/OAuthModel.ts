import { randomBytes } from "node:crypto";

import prisma from "@director_v2/db";
import jwt from "jsonwebtoken";

import { loadKeyConfig } from "./keyLoader";

export class OAuthModel {
  private keyConfig = loadKeyConfig();

  constructor() {
    if (!this.keyConfig) {
      console.warn(
        "OAuth key configuration not found. To sign JWTs set either RS256 keys or HS256 secret. " +
          "Example for HS256: OAUTH_JWT_ALG=HS256 and OAUTH_JWT_SECRET=<your-secret>"
      );
    }
  }

  async generateAccessToken(client: any, user: any, scope?: string | string[]): Promise<string> {
    const jti = randomBytes(20).toString("hex");
    const iat = Math.floor(Date.now() / 1000);
    const accessTokenLifetimeSeconds = 60 * 60 * 24 * 365; // 1 year
    const payload: any = {
      aud: client.id,
      jti,
      iat,
      nbf: iat,
      exp: iat + accessTokenLifetimeSeconds,
      sub: String(user?.id ?? user),
      scopes: Array.isArray(scope) ? scope : scope ? scope.toString().split(" ") : [],
    };

    if (!this.keyConfig) {
      return jwt.sign(payload, "dev-temp-secret", { algorithm: "HS256" });
    }

    if (this.keyConfig.algorithm === "RS256") {
      return jwt.sign(payload, this.keyConfig.privateKey, {
        algorithm: "RS256",
      });
    }
    return jwt.sign(payload, this.keyConfig.secret, { algorithm: "HS256" });
  }

  async generateRefreshToken(client: any, user: any, scope?: string | string[]): Promise<string> {
    const jti = randomBytes(20).toString("hex");
    const iat = Math.floor(Date.now() / 1000);
    const refreshTokenLifetimeSeconds = 60 * 60 * 24 * 365; // 1 year

    const payload: any = {
      aud: client.id,
      jti,
      iat,
      nbf: iat,
      exp: iat + refreshTokenLifetimeSeconds,
      sub: String(user?.id ?? user),
      scopes: Array.isArray(scope) ? scope : scope ? scope.toString().split(" ") : [],
    };

    if (!this.keyConfig) {
      return jwt.sign(payload, "dev-temp-secret", { algorithm: "HS256" });
    }

    if (this.keyConfig.algorithm === "RS256") {
      return jwt.sign(payload, this.keyConfig.privateKey, {
        algorithm: "RS256",
      });
    }
    return jwt.sign(payload, this.keyConfig.secret, { algorithm: "HS256" });
  }

  async getClient(clientId: string, clientSecret: string | null) {
    const client = await prisma.oauth_clients.findFirst({
      where: {
        id: clientId,
        revoked: false,
      },
    });

    if (!client) {
      return false;
    }

    // Validate client secret (empty string matches null/empty)
    const storedSecret = client.secret || "";
    const providedSecret = clientSecret || "";

    if (storedSecret !== providedSecret) {
      return false;
    }

    return {
      id: client.id,
      redirectUris: client.redirect ? [client.redirect] : [],
      grants: ["password", "refresh_token"],
    };
  }

  async getUser(username: string, password: string) {
    const user = await prisma.user.findFirst({
      where: {
        OR: [{ email: username }, { msisdn: username }],
      },
    });

    if (!user) {
      return false;
    }

    const isValid = await Bun.password.verify(password, user.password);

    if (!isValid) {
      return false;
    }

    return {
      id: user.id,
      email: user.email,
      msisdn: user.msisdn,
      name: user.name,
    };
  }

  async saveToken(token: any, client: any, user: any) {
    // Decode JWT to get unique token ID
    let accessTokenId: string | null = null;
    if (token.accessToken) {
      try {
        const decoded: any = jwt.decode(token.accessToken);
        accessTokenId = decoded?.jti || null;
      } catch (err) {
        console.warn("Failed to decode access token JWT:", err);
      }
    }

    if (!accessTokenId) {
      accessTokenId = this.generateTokenId();
    }

    // Save access token record
    const accessToken = await prisma.oauth_access_tokens.create({
      data: {
        id: accessTokenId,
        user_id: BigInt(user.id),
        client_id: client.id,
        name: null,
        revoked: false,
        expires_at: token.accessTokenExpiresAt,
        created_at: new Date(),
        updated_at: new Date(),
      },
    });

    // Save refresh token if present
    if (token.refreshToken) {
      const decoded: any = jwt.decode(token.refreshToken);
      const refreshTokenId = decoded?.jti || null;
      await prisma.oauth_refresh_tokens.create({
        data: {
          id: String(refreshTokenId),
          access_token_id: accessToken.id,
          revoked: false,
          expires_at: token.refreshTokenExpiresAt,
        },
      });
    }

    return {
      accessToken: token.accessToken,
      accessTokenExpiresAt: token.accessTokenExpiresAt,
      refreshToken: token.refreshToken ? token.refreshToken : null,
      refreshTokenExpiresAt: token.refreshTokenExpiresAt,
      client: { id: client.id, grants: ["password", "refresh_token"] },
      user: { id: user.id },
    };
  }

  async getAccessToken(accessToken: string) {
    if (!this.keyConfig) {
      return false;
    }

    let payload: any = null;
    try {
      const verifyKey =
        this.keyConfig.algorithm === "RS256" ? this.keyConfig.publicKey : this.keyConfig.secret;
      payload = jwt.verify(accessToken, verifyKey as any, {
        algorithms: [this.keyConfig.algorithm],
      }) as any;
    } catch (err: unknown) {
      return false;
    }

    const jti = payload?.jti;
    if (!jti) return false;

    const token = await prisma.oauth_access_tokens.findFirst({
      where: {
        id: jti,
        revoked: false,
      },
    });

    if (!token) return false;

    const expiresAt = payload.exp ? new Date(payload.exp * 1000) : token.expires_at;
    if (expiresAt && expiresAt < new Date()) return false;

    return {
      accessToken,
      accessTokenExpiresAt: expiresAt || undefined,
      client: { id: token.client_id, grants: ["password", "refresh_token"] },
      user: { id: token.user_id },
    };
  }

  async getRefreshToken(refreshToken: string) {
    if (!this.keyConfig) {
      return false;
    }

    let payload: any = null;
    try {
      const verifyKey =
        this.keyConfig.algorithm === "RS256" ? this.keyConfig.publicKey : this.keyConfig.secret;
      payload = jwt.verify(refreshToken, verifyKey as any, {
        algorithms: [this.keyConfig.algorithm],
      }) as any;
    } catch (err: unknown) {
      return false;
    }

    const jti = payload?.jti;
    if (!jti) return false;

    const token = await prisma.oauth_refresh_tokens.findFirst({
      where: {
        id: jti,
        revoked: false,
      },
    });

    if (!token) return false;

    const accessToken = await prisma.oauth_access_tokens.findUnique({
      where: {
        id: token.access_token_id,
      },
    });

    if (!accessToken) return false;

    const expiresAt: Date | undefined = payload.exp
      ? new Date(payload.exp * 1000)
      : token.expires_at || undefined;
    if (expiresAt && expiresAt < new Date()) return false;

    return {
      refreshToken,
      refreshTokenExpiresAt: expiresAt,
      scope: payload.scopes ? payload.scopes.join(" ") : "",
      client: { id: accessToken.client_id, grants: ["password", "refresh_token"] },
      user: { id: accessToken.user_id },
    };
  }

  async revokeToken(token: any) {
    await prisma.oauth_refresh_tokens.updateMany({
      where: {
        id: token.refreshToken,
      },
      data: {
        revoked: true,
      },
    });

    return true;
  }

  async verifyScope(_token: any, _scope: string | string[]) {
    // Accept all scopes for now
    return true;
  }

  private generateTokenId(): string {
    return randomBytes(40).toString("hex");
  }
}
