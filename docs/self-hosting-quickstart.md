# Signet

## Docker quickstart

Requirements: Docker with Compose v2.24 or newer. No local Node.js, pnpm, Elixir, or PostgreSQL installation is needed.

1. Create the environment file:

   ```sh
   cp .env.example .env
   ```

2. In `.env`, replace `POSTGRES_PASSWORD` and `SECRET_KEY_BASE` with random values. Use URL-safe letters, numbers, hyphens, or underscores; the secret key base must be at least 64 characters. Keep `PHX_HOST=localhost` for local HTTP.

3. Pull the published images and start the complete stack:

   ```sh
   docker compose pull
   docker compose up -d
   ```

4. Open <http://localhost:8080>. The web container serves the production frontend and proxies API requests and `/healthz` to the API. Direct navigation to SPA routes such as <http://localhost:8080/login> is supported. API readiness is available at <http://localhost:8080/healthz>.

PostgreSQL and Phoenix are only reachable on the Compose network; neither publishes a host port. PostgreSQL data is retained in the `db_data` named volume across container recreation. Caddy state is retained in `caddy_data` and `caddy_config`. Migrations run automatically before Phoenix starts.

To use another local port, set `WEB_PORT` in `.env`. To stop the stack, run `docker compose stop`. To remove the containers while retaining accounts and bookmarks, run `docker compose down`; add `--volumes` only when you intentionally want to delete the database and Caddy state.

## GHCR images and release pinning

The default `compose.yaml` uses `ghcr.io/christopher2k/signet-api` and `ghcr.io/christopher2k/signet-web`. `SIGNET_VERSION=latest` selects the most recent stable release. To pin a release instead, set a published version in `.env`, for example:

```dotenv
SIGNET_VERSION=1.2.3
```

Workflow releases tagged `v1.2.3` publish image version `1.2.3`. Each non-PR workflow publish also creates an immutable `sha-<full-commit-sha>` tag, which can be used as `SIGNET_VERSION` for an exact source revision. Stable version tags also update `latest`; prerelease tags and ordinary branch builds do not.

After the first publish, a repository maintainer must make **both** GHCR packages public in their GitHub package settings. This one-time step is required for anonymous `docker compose pull` on new installations. Package visibility cannot be configured by Compose or the publishing workflow.

## Build from source

Use the build override to create local `signet-api:local` and `signet-web:local` images instead of pulling GHCR images:

```sh
docker compose -f compose.yaml -f compose.build.yaml up --build
```

This preserves the same local HTTP endpoints, database persistence, health checks, and automatic migrations as the default distribution stack.

## Public HTTPS

Use a stable `SIGNET_VERSION` rather than `latest` for a production deployment. Create a public DNS A and/or AAAA record for the server, allow inbound TCP ports 80 and 443, and set its hostname in `.env`:

```dotenv
SIGNET_DOMAIN=signet.example.com
```

Then start the public configuration:

```sh
docker compose -f compose.yaml -f compose.https.yaml up -d
```

The override publishes ports 80 and 443, passes the public hostname to both Caddy and Phoenix, and lets Caddy obtain and renew certificates automatically. Caddy forwards the public host and protocol to Phoenix. Certificates and configuration state persist in the named Caddy volumes. Do not use `localhost` or an unrelated hostname for a public deployment.

To build from source with public HTTPS, combine both overrides:

```sh
docker compose -f compose.yaml -f compose.build.yaml -f compose.https.yaml up --build -d
```

The default configuration remains local-only HTTP and needs neither a public domain nor a certificate.

## Cloudflare Tunnel

Use this configuration **instead of** `compose.https.yaml` when Cloudflare terminates public HTTPS. Set the tunnel's public hostname in `.env`:

```dotenv
SIGNET_DOMAIN=signet.example.com
```

Start the HTTP origin with the Cloudflare override:

```sh
docker compose -f compose.yaml -f compose.cloudflare.yaml up -d
```

Configure the tunnel service as `http://localhost:8080` when `cloudflared` runs on the Docker host, or `http://web:80` when it is attached to the same Compose network. Enable Cloudflare **Always Use HTTPS** for the public hostname. No public host ports or origin certificates are required; the origin remains bound to loopback by default.

The override keeps Caddy on HTTP and explicitly forwards the configured public hostname, port 443, and HTTPS protocol to Phoenix. This prevents Phoenix from issuing SSL redirects for requests that already reached Cloudflare over HTTPS. Only use this override behind an HTTPS tunnel; do not expose its HTTP origin directly to untrusted networks.

To build the origin from source, combine the build and Cloudflare overrides:

```sh
docker compose -f compose.yaml -f compose.build.yaml -f compose.cloudflare.yaml up --build -d
```
