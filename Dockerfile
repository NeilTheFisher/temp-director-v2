FROM oven/bun:1.0.33-alpine AS builder

WORKDIR /usr/src/app

RUN apk add npm

COPY package.json bun.lockb ./
RUN bun install --production

COPY . .

# RUN bun run lint
RUN bun run build

FROM oven/bun:1.0.33-alpine

WORKDIR /usr/src/app

COPY --from=builder /usr/src/app/build ./
COPY --from=builder /usr/src/app/priv/public.key ./priv/public.key
COPY --from=builder /usr/src/app/odienceapis ./odienceapis
COPY --from=builder /usr/src/app/generated-protos ./generated-protos

# install external dependencies
RUN bun add i18n-iso-countries

CMD bun app.js
