FROM oven/bun:1.1.4-alpine AS builder

WORKDIR /usr/src/app

RUN apk add npm

COPY package.json bun.lockb ./
RUN bun install

COPY . .

# RUN bun run lint
RUN bun run build

FROM oven/bun:1.1.4-alpine

WORKDIR /usr/src/app

COPY --from=builder /usr/src/app/build ./
COPY --from=builder /usr/src/app/priv/public.key ./priv/public.key
COPY --from=builder /usr/src/app/odienceapis ./odienceapis
COPY --from=builder /usr/src/app/generated-protos ./generated-protos

CMD bun app.js
