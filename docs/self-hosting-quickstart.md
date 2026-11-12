# Signet self-hosting quickstart

Requirements: Docker with Compose v2.24 or newer, `curl`, and OpenSSL. No local Node.js, pnpm, Elixir, or PostgreSQL installation is needed. See the [operator guide](self-hosting.md) for deployment details and all maintenance procedures.

## Install published images without cloning

1. Create a directory and download the deployment files:

   ```sh
   mkdir signet
   cd signet
   curl -fsSLO https://raw.githubusercontent.com/Christopher2K/signet/main/compose.yaml
   curl -fsSLO https://raw.githubusercontent.com/Christopher2K/signet/main/.env.example
   cp .env.example .env
   ```

2. Generate two secrets:

   ```sh
   openssl rand -hex 32
   openssl rand -hex 48
   ```

   In `.env`, replace `POSTGRES_PASSWORD` with the first value and `SECRET_KEY_BASE` with the second. Keep `PHX_HOST=localhost` for local HTTP. For a public deployment, follow the release-tag instructions below before starting Signet.

3. Pull and start Signet:

   ```sh
   docker compose pull
   docker compose up -d
   ```

4. Open <http://localhost:8080> and create an account. API readiness is available at <http://localhost:8080/healthz>.

The first published release requires a maintainer to make both GHCR packages public; see [GHCR package visibility](self-hosting.md#ghcr-package-visibility-for-maintainers).

## Build from a source checkout

Clone the repository, copy `.env.example` to `.env`, and generate secrets as above. Then run:

```sh
docker compose -f compose.yaml -f compose.build.yaml up --build -d
```

This creates local `signet-api:local` and `signet-web:local` images without pulling the application images from GHCR.

## Public HTTPS

For a direct public deployment, create a public DNS A record for the server's IPv4 address, allow inbound TCP ports 80 and 443, and set this in `.env`:

```dotenv
SIGNET_DOMAIN=signet.example.com
SIGNET_VERSION=1.2.3
```

Registry-only installations must download the base and HTTPS Compose files from the matching release tag. Replace both occurrences of `v1.2.3` and the `SIGNET_VERSION` value together when choosing another release:

```sh
curl -fsSLO https://raw.githubusercontent.com/Christopher2K/signet/v1.2.3/compose.yaml
curl -fsSLO https://raw.githubusercontent.com/Christopher2K/signet/v1.2.3/compose.https.yaml
docker compose -f compose.yaml -f compose.https.yaml pull
docker compose -f compose.yaml -f compose.https.yaml up -d
```

Open `https://signet.example.com`. Use the same public server URL in the browser and native clients. For source builds, add `-f compose.build.yaml` before `-f compose.https.yaml` and use `up --build -d` instead of `pull` and `up`.

Do not expose the default local HTTP configuration publicly. DNS, firewall, existing reverse proxy, and certificate troubleshooting details are in the [public deployment guide](self-hosting.md#public-https).

## Operate the instance

The [operator guide](self-hosting.md) covers:

- [service status and logs](self-hosting.md#status-and-logs);
- [stable upgrades and rollback limits](self-hosting.md#upgrade);
- [tested PostgreSQL backup and restore commands](self-hosting.md#postgresql-backup);
- [operator password resets](self-hosting.md#reset-an-accounts-password);
- [named volumes and safe removal](self-hosting.md#storage-and-removal).

Migrations run automatically before Phoenix starts. PostgreSQL, account, bookmark, and session data persist in `db_data`; Caddy certificate and configuration state persist in `caddy_data` and `caddy_config`. `docker compose down` removes containers and the network without deleting these volumes; a subsequent `docker compose up -d` recreates the services. **Never add `--volumes` unless you intend to permanently delete that deployment's data.**
