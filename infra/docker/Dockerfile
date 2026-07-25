# Nest CLI monorepo'daki tüm apps/* servisleri için ortak Dockerfile.
# docker-compose'da build.args ile APP_NAME verilerek (ör. gateway, auth-service) parametrize edilir.

FROM node:20-alpine AS deps
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm ci

FROM deps AS build
ARG APP_NAME
COPY . .
RUN npx nest build ${APP_NAME}

FROM node:20-alpine AS runtime
ARG APP_NAME
ENV APP_NAME=${APP_NAME}
ENV NODE_ENV=production
WORKDIR /usr/src/app
COPY --from=deps /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/dist ./dist
COPY --from=build /usr/src/app/proto ./proto
COPY package*.json ./

CMD node dist/apps/${APP_NAME}/main.js
