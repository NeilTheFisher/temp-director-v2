import prisma from "@director_v2/db";
import { validateAndFormatPhoneNumber } from "../utils/phone-validation";
import * as acs from "./acs";

/**
 * OdienceService - User provisioning service
 * Handles user creation and provisioning via ACS
 * Mirrors director-api OdienceService
 */

export async function provisionUser(
  rawMsisdn: string,
  countryCode = "",
): Promise<{ code: number; message: string }> {
  let msisdn = rawMsisdn.replace(/\D/g, "");

  console.log("OdienceService.provisionUser: msisdn:", msisdn);

  const objValidateMsisdn = await validateAndFormatPhoneNumber(
    msisdn,
    countryCode,
  );

  if (!objValidateMsisdn.valid || objValidateMsisdn.error) {
    return {
      code: 400,
      message: `OdienceService.provisionUser validateMsisdn: ${msisdn} failed with error: ${objValidateMsisdn.error}`,
    };
  }

  console.log("OdienceService.provisionUser: msisdn was validated");
  msisdn = objValidateMsisdn.formatted;

  if (!msisdn) {
    return {
      code: 400,
      message: "MSISDN: is empty",
    };
  }

  try {
    let user = await prisma.user.findUnique({
      where: { msisdn: msisdn },
    });

    if (!user) {
      user = await createNewRegisteredUser(msisdn);
      if (!user) {
        console.log(
          "OdienceService.provisionUser: user created?:",
          user != null,
        );
        return {
          code: 500,
          message: "OdienceService.provisionUser: Failed to create a user",
        };
      }
      console.log("OdienceService.provisionUser: just created user: ", user);
    }

    console.log("OdienceService.provisionUser: using user: ", user);

    // Setup personal group for user
    await setupPersonalGroup(user);

    // Refresh user from DB
    user = await prisma.user.findUnique({
      where: { msisdn: msisdn },
    });

    if (
      user &&
      (!user.otp_created_at ||
        new Date(user.otp_created_at).getTime() < Date.now())
    ) {
      console.log(
        "OdienceService.provisionUser: otp_created_at was done earlier or is undefined",
      );

      const otp = crypto.randomUUID();
      console.log("OTP Created: ", otp);

      const hashedOtp = await Bun.password.hash(otp, {
        algorithm: "bcrypt",
        cost: 8,
      });

      user = await prisma.user.update({
        where: { id: user.id },
        data: {
          otp: hashedOtp,
          otp_created_at: new Date(),
          is_deleted: false,
          deleted_timestamp: null,
        },
      });

      console.log("OdienceService.provisionUser: user updated with OTP");

      // Try to update user via ACS first
      let objResponse = await acs.updateUser(
        msisdn,
        otp,
        objValidateMsisdn.country_code,
      );
      console.log(
        "OdienceService.provisionUser: updateUser result: ",
        objResponse,
      );

      if (objResponse.code !== 200) {
        // If update fails, try to create
        objResponse = await acs.createUser(
          msisdn,
          otp,
          objValidateMsisdn.country_code,
        );
        console.log(
          "OdienceService.provisionUser: createUser result: ",
          objResponse,
        );
      }

      return objResponse;
    }

    console.log(objValidateMsisdn.valid, objValidateMsisdn.error);
    return {
      code: 403,
      message: `OdienceService.provisionUser validateMsisdn: ${msisdn} failed with error: ${objValidateMsisdn.error}`,
    };
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    console.error(
      `OdienceService.provisionUser: for msisdn: ${msisdn}, error => ${errorMessage}`,
    );
    return {
      code: 500,
      message: `OdienceService.provisionUser. msisdn: ${msisdn} failed with error: ${errorMessage}`,
    };
  }
}

/**
 * Create a new registered user
 * Mirrors director-api UserService.createNewRegisteredUser
 */
export async function createNewRegisteredUser(msisdn: string) {
  const password = crypto.randomUUID();
  console.log("password generated:", password);
  const hashedPassword = await Bun.password.hash(password, {
    algorithm: "bcrypt",
    cost: 10,
  });

  try {
    const newUser = await prisma.user.create({
      data: {
        msisdn: msisdn,
        password: hashedPassword,
        type: "user",
        created_at: new Date(),
        updated_at: new Date(),
      },
    });

    return newUser;
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    console.error("OdienceService.createNewRegisteredUser:", errorMessage);
    return null;
  }
}

/**
 * Setup personal group for a user
 * Creates a personal group for the user if it doesn't exist
 */
export async function setupPersonalGroup(user: {
  id: bigint;
  msisdn: string | null;
  name: string | null;
  personal_group_id: bigint | null;
}) {
  try {
    // Check if personal group already exists
    if (user.personal_group_id) {
      console.log(
        "OdienceService.setupPersonalGroup: Personal group already exists for user",
      );
      return;
    }

    // Create a personal group for the user
    const timestamp = Math.floor(Date.now() / 1000);
    const personalGroup = await prisma.group.create({
      data: {
        name: `${user.name || user.msisdn}'s Personal Group`,
        created_at: timestamp,
        updated_at: timestamp,
      },
    });

    // Update user with personal group ID
    await prisma.user.update({
      where: { id: user.id },
      data: {
        personal_group_id: personalGroup.id,
      },
    });

    console.log("OdienceService.setupPersonalGroup: Personal group created");
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    console.error("OdienceService.setupPersonalGroup:", errorMessage);
  }
}
