FROM oven/bun:1.3.3-alpine AS base

WORKDIR /app

FROM base AS builder

# Install dependencies

COPY package.json bun.lock turbo.json ./
COPY apps/web/package.json ./apps/web/package.json
COPY packages/api/package.json ./packages/api/package.json
COPY packages/auth/package.json ./packages/auth/package.json
COPY packages/env/package.json ./packages/env/package.json
COPY packages/contracts/package.json ./packages/contracts/package.json
COPY packages/db/package.json ./packages/db/package.json

RUN bun install --no-save --no-cache

# Build the application

COPY . .

RUN bun run db:generate

ENV NEXT_TELEMETRY_DISABLED=1

RUN bun run build

FROM base AS runner
WORKDIR /app

ENV NEXT_TELEMETRY_DISABLED=1

ENV NODE_ENV=production \
    PORT=3000 \
    HOSTNAME="0.0.0.0"

COPY --from=builder /app/apps/web/.next/standalone ./

EXPOSE 3000

CMD ["bun", "./apps/web/server.js"]