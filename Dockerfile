FROM node:21 AS builder

WORKDIR /usr/src/app
# COPY package*.json tsconfig.json ./
COPY .eslintignore .eslintrc.yml package*.json tsconfig.json ./
RUN npm ci --omit=dev
COPY src ./src
COPY priv ./priv
RUN npm install -g npm@latest && npm install -g eslint && npm ci
RUN npm run lint
RUN npm run build

FROM node:21-alpine

WORKDIR /usr/src/app
COPY --from=builder /usr/src/app/package*.json ./
COPY --from=builder /usr/src/app/build ./dist
# COPY --from=builder /usr/src/app/priv ./priv
RUN npm ci --omit=dev

# EXPOSE 3000

CMD ["node", "dist/app.js"]
