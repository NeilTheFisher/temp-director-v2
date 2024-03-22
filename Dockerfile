FROM oven/bun:1.0.26-alpine AS builder

WORKDIR /usr/src/app

RUN apk add npm

COPY package.json bun.lockb ./
RUN bun install --production

COPY . .

# RUN bun run lint
RUN bun run build

FROM oven/bun:1.0.26-alpine

WORKDIR /usr/src/app

COPY --from=builder /usr/src/app/build ./

COPY --from=builder /usr/src/app/priv/public.key ./priv/public.key

# install external dependencies
RUN bun add i18n-iso-countries

CMD bun app.js
