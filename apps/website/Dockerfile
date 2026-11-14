# syntax=docker/dockerfile:1
FROM node:24-bookworm-slim AS builder
WORKDIR /app

RUN npm install -g pnpm@12.18.0

COPY . .
RUN pnpm install --frozen-lockfile
RUN pnpm --filter @signet/website build

FROM caddy:2-alpine
WORKDIR /srv

COPY --from=builder /app/apps/website/dist/client/ ./
COPY apps/website/Caddyfile /etc/caddy/Caddyfile

EXPOSE 80
