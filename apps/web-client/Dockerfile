# syntax=docker/dockerfile:1

FROM node:24.11.1-bookworm-slim AS build

ENV HUSKY=0
WORKDIR /app

RUN npm install --global pnpm@12.18.0

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/web-client/package.json ./apps/web-client/package.json
COPY libs/api/package.json ./libs/api/package.json
COPY libs/core/package.json ./libs/core/package.json
COPY libs/design-system/package.json ./libs/design-system/package.json
COPY libs/locale/package.json ./libs/locale/package.json

RUN pnpm install --filter @signet/web-client... --frozen-lockfile

COPY apps/web-client ./apps/web-client
COPY libs ./libs

RUN env -u API_URL pnpm --filter @signet/web-client build

FROM caddy:2.10.2-alpine AS runtime

RUN addgroup -S signet \
    && adduser -S -D -H -G signet signet \
    && mkdir -p /data/caddy /config/caddy \
    && chown -R signet:signet /data /config

ENV SIGNET_FORWARDED_HOST="{host}" \
    SIGNET_FORWARDED_PORT="{port}" \
    SIGNET_FORWARDED_PROTO="{scheme}"

COPY apps/web-client/Caddyfile /etc/caddy/Caddyfile
COPY --from=build /app/apps/web-client/dist /srv

USER signet:signet
EXPOSE 80 443
