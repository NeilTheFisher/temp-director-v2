FROM oven/bun:1.1.4-alpine AS deps

WORKDIR /usr/src/app

RUN apk add npm

COPY package.json bun.lockb ./
# RUN bun install
# Instead of `bun install`, to avoid issues with aws-sdk reflection:
RUN npm install --omit dev

FROM deps as builder

COPY . .

RUN npm install
# RUN bun run lint
RUN bun run build

FROM oven/bun:1.1.4-alpine as built

WORKDIR /usr/src/app

COPY --from=builder /usr/src/app/build ./
COPY --from=builder /usr/src/app/priv/public.key ./priv/public.key
COPY --from=builder /usr/src/app/odienceapis ./odienceapis
COPY --from=builder /usr/src/app/generated-protos ./generated-protos
COPY --from=deps /usr/src/app/node_modules ./node_modules

CMD bun app.js

FROM built as test

RUN bun app.js test && touch /.test-passed

FROM built as final

COPY --from=test /.test-passed /.test-passed