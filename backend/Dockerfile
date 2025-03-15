FROM node:22-alpine3.20 AS base

ENV DIR /app
WORKDIR $DIR
ARG NPM_TOKEN

FROM base AS dev

ENV NODE_ENV=development
ENV CI=true

RUN npm install -g pnpm@9.14.2

COPY package.json pnpm-lock.yaml ./

RUN echo "//registry.npmjs.org/:_authToken=$NPM_TOKEN" > ".npmrc" && \
    pnpm install --frozen-lockfile && \
    rm -f .npmrc

COPY tsconfig*.json .
COPY src src
COPY uploads uploads

EXPOSE 3000
CMD ["node", "--run", "dev"]

FROM base AS build

ENV CI=true

RUN apk update && apk add --no-cache dumb-init=1.2.5-r3 && npm install -g pnpm@9.14.2

COPY package.json pnpm-lock.yaml ./
RUN echo "//registry.npmjs.org/:_authToken=$NPM_TOKEN" > ".npmrc" && \
    pnpm install --frozen-lockfile && \
    rm -f .npmrc

COPY tsconfig*.json .
COPY .swcrc .
COPY src src
COPY uploads uploads

RUN node --run build && \
    pnpm prune --prod

# Production Stage
FROM base AS production
ENV NODE_ENV=production
ENV USER=node
COPY --from=build /usr/bin/dumb-init /usr/bin/dumb-init
COPY --from=build $DIR/package.json $DIR/pnpm-lock.yaml ./
COPY --from=build $DIR/node_modules node_modules
COPY --from=build $DIR/dist dist
COPY --from=build $DIR/uploads dist/uploads
# Aseguramos que el usuario node tiene permiso para escribir en uploads
RUN chown -R node:node dist/uploads
USER $USER
EXPOSE 3001
CMD ["dumb-init", "node", "dist/app.js"]
