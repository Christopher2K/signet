# Signet operator guide

This guide covers registry-only and source installations, public HTTPS, routine maintenance, and safe removal. For a shorter local installation, use the [quickstart](self-hosting-quickstart.md).

## Requirements

- Docker with Compose v2.24 or newer.
- `curl` and OpenSSL for the installation commands below.
- For public HTTPS, a public DNS name and control of the server's firewall.

Node.js, pnpm, Elixir, and PostgreSQL do not need to be installed on the Docker host. PostgreSQL and Phoenix are private to the Compose network; only the web service publishes a host port.

## Install

### Registry-only installation

No repository clone or application build is needed. Create a deployment directory and download the Compose files:

```sh
mkdir signet
cd signet
curl -fsSLO https://raw.githubusercontent.com/Christopher2K/signet/main/compose.yaml
curl -fsSLO https://raw.githubusercontent.com/Christopher2K/signet/main/.env.example
cp .env.example .env
```

For a reproducible production installation, download the files from the matching `v1.2.3` release tag instead of `main`, and set `SIGNET_VERSION=1.2.3` in `.env`.

Generate the database password and Phoenix secret separately:

```sh
openssl rand -hex 32
openssl rand -hex 48
```

In `.env`, replace `POSTGRES_PASSWORD` with the first output and `SECRET_KEY_BASE` with the second. Keep these values secret and back up `.env` securely. The hexadecimal values are URL-safe; `SECRET_KEY_BASE` must contain at least 64 characters. Do not reuse the example placeholders or production secrets in a test deployment.

The default images are `ghcr.io/christopher2k/signet-api` and `ghcr.io/christopher2k/signet-web`. `SIGNET_VERSION=latest` selects the latest stable release. Production deployments should pin a released version such as `1.2.3` or an immutable `sha-<full-commit-sha>` tag instead. A workflow release tagged `v1.2.3` publishes image version `1.2.3`.

### Source build

Clone the repository and configure secrets as above:

```sh
git clone https://github.com/Christopher2K/signet.git
cd signet
cp .env.example .env
```

The build override creates `signet-api:local` and `signet-web:local`; `SIGNET_VERSION` does not apply to these local application images.

### Select the deployment mode

Run the appropriate `export` from the deployment directory in each new shell. The remaining commands in this guide use that selection, so upgrades, backups, and maintenance cannot accidentally target a different Compose configuration.

| Mode | Compose selection |
| --- | --- |
| Registry images, local HTTP | `export COMPOSE_FILE=compose.yaml` |
| Source images, local HTTP | `export COMPOSE_FILE=compose.yaml:compose.build.yaml` |
| Registry images, direct public HTTPS | `export COMPOSE_FILE=compose.yaml:compose.https.yaml` |
| Source images, direct public HTTPS | `export COMPOSE_FILE=compose.yaml:compose.build.yaml:compose.https.yaml` |
| Registry images, existing HTTPS proxy | `export COMPOSE_FILE=compose.yaml:compose.cloudflare.yaml` |
| Source images, existing HTTPS proxy | `export COMPOSE_FILE=compose.yaml:compose.build.yaml:compose.cloudflare.yaml` |

Registry-only installations must download each selected override from the same repository ref as `compose.yaml`, for example:

```sh
curl -fsSLO https://raw.githubusercontent.com/Christopher2K/signet/main/compose.https.yaml
```

Use `compose.cloudflare.yaml` instead when an existing proxy or Cloudflare Tunnel terminates HTTPS. Do not combine the HTTPS and Cloudflare/proxy overrides.

## Local evaluation

The default configuration is local-only HTTP. It needs no DNS record or certificate and binds to `127.0.0.1` on port `8080`.

For registry images:

```sh
docker compose pull
docker compose up -d
```

For a source build:

```sh
docker compose up --build -d
```

Open <http://localhost:8080> and create an account. Direct navigation to SPA routes such as `/login` works. Check API readiness with:

```sh
curl --fail http://localhost:8080/healthz
```

Set `WEB_PORT` in `.env` to use another local port. The default loopback binding is not reachable from another device. For native and browser clients sharing a deployment, use a properly configured public HTTPS URL as described below rather than exposing the local evaluation stack.

## Public HTTPS

### Direct automatic HTTPS

1. Create a public DNS **A** record for `signet.example.com` that points to this Docker server's public IPv4 address. The default `PUBLIC_BIND_ADDRESS=0.0.0.0` publishes IPv4 only; do not advertise an AAAA record unless you have separately configured and verified IPv6 for Docker.
2. Allow inbound TCP ports **80** and **443** through the host and network firewalls. Caddy needs both ports for certificate issuance/renewal and HTTPS traffic. Do not open PostgreSQL or Phoenix ports.
3. Set a pinned release and the public hostname in `.env`:

   ```dotenv
   SIGNET_VERSION=1.2.3
   SIGNET_DOMAIN=signet.example.com
   ```

4. Select the direct HTTPS Compose files, then pull and start:

   ```sh
   docker compose pull
   docker compose up -d
   ```

For source images, use `docker compose up --build -d` instead of `pull` and `up`.

Caddy obtains and renews certificates automatically. The override passes `SIGNET_DOMAIN` to Phoenix as `PHX_HOST` and forwards the public host and HTTPS protocol to Phoenix. Open `https://signet.example.com` and check `https://signet.example.com/healthz`. If issuance fails, confirm public DNS resolution and inbound access to both ports, then inspect the web logs. The first public certificate issuance must be checked during the actual public release.

### Existing reverse proxy or Cloudflare Tunnel

Use `compose.cloudflare.yaml` **instead of** `compose.https.yaml` whenever an existing external proxy terminates public HTTPS. Despite its filename, this override works for both a conventional reverse proxy and Cloudflare Tunnel.

Set `SIGNET_DOMAIN=signet.example.com` in `.env` and select the proxy Compose files. Configure the proxy's HTTP origin as:

- `http://127.0.0.1:8080` when the proxy runs on the Docker host;
- `http://web:80` when the proxy is attached to the same Compose network.

Start registry images with `docker compose pull && docker compose up -d`, or source images with `docker compose up --build -d`. Redirect HTTP to HTTPS at the external proxy; for Cloudflare, enable **Always Use HTTPS**.

The origin remains bound to loopback by default. The override sets Phoenix's public host to `SIGNET_DOMAIN` and explicitly forwards port `443` and protocol `https`, preventing Phoenix from redirecting requests that already reached the proxy over HTTPS. Do not expose the HTTP origin directly to untrusted networks or use this override without external HTTPS termination.

For all public configurations, enter the same base URL, `https://signet.example.com`, in browser and native clients. Do not append `/api` or use a separate API hostname.

## Status and logs

```sh
docker compose ps
docker compose logs --tail=100 api web db
docker compose logs -f api
```

Press Ctrl-C to stop following logs; this does not stop the service. Check local readiness with `curl --fail http://localhost:8080/healthz`, or use the configured HTTPS URL for a public deployment. Migrations run automatically each time the API container starts, before Phoenix accepts traffic.

## PostgreSQL backup

A custom-format dump includes the schema, accounts, sessions, and bookmarks. It does not include `.env`, Caddy certificates, or Compose files. Keep `.env` and these dumps securely; database dumps contain private user data.

Run from the deployment directory with the normal Compose selection:

```sh
(
  set -e
  mkdir -p backups
  umask 077
  BACKUP="backups/signet-$(date +%Y%m%d-%H%M%S).dump"
  docker compose exec -T db sh -c 'pg_dump --format=custom --username="$POSTGRES_USER" --dbname="$POSTGRES_DB"' > "$BACKUP"
  test -s "$BACKUP"
  docker compose exec -T db pg_restore --list < "$BACKUP" > /dev/null
  printf 'Created and verified %s\n' "$BACKUP"
)
```

`pg_dump` produces a consistent backup while Signet is running. The subshell stops on a dump or verification failure, and `pg_restore --list` confirms that the resulting file is readable before reporting success. Store a copy outside the Docker host. Always create and verify a fresh backup before an upgrade.

## Upgrade

1. Create a backup using the commands above.
2. For registry images, set `SIGNET_VERSION` in `.env` to the new stable version. Do not use `latest` when an upgrade must be reproducible.
3. Pull the selected images and recreate changed containers:

   ```sh
   docker compose pull
   docker compose up -d
   ```

   For a source installation, update the checkout and rebuild instead:

   ```sh
   git pull --ff-only
   docker compose up --build -d
   ```

4. Verify the deployment before resuming normal use:

   ```sh
   docker compose ps
   docker compose logs --tail=100 api
   curl --fail http://localhost:8080/healthz
   ```

   Use the public health URL when applicable. Log in with an existing account and confirm its bookmarks. The API startup command runs pending migrations automatically; running it again when no migrations are pending is safe.

To verify container recreation without deleting data, run `docker compose down`, then `docker compose up -d`, and log in again. Do not add `--volumes`.

### Rollback limitations

An image rollback is only safe when the previous application version can read the current database schema. Rolling back `SIGNET_VERSION` and running `pull`/`up` does **not** undo migrations. If a newer release ran incompatible or destructive migrations, restoring the old image alone can fail or corrupt data.

To return to the pre-upgrade state, restore the pre-upgrade backup while running the previous compatible release. This discards changes made after that backup. Keep the previous release tag and backup until the upgrade is verified.

## PostgreSQL restore

**This replaces the selected project's current database.** Confirm `COMPOSE_FILE`, the deployment directory, and `docker compose ps` before continuing. For a fresh restore deployment, use its own directory or Compose project name so its named volumes cannot overwrite another installation. Use the same `POSTGRES_USER` and `POSTGRES_DB` values that created the dump.

Set `BACKUP` to an existing dump, then run:

```sh
(
  set -e
  BACKUP="backups/signet-20261112-120000.dump"
  test -s "$BACKUP"
  docker compose up -d --wait db
  docker compose stop web api
  docker compose exec -T db sh -c 'dropdb --force --if-exists --username="$POSTGRES_USER" "$POSTGRES_DB" && createdb --username="$POSTGRES_USER" "$POSTGRES_DB"'
  docker compose exec -T db sh -c 'pg_restore --exit-on-error --format=custom --username="$POSTGRES_USER" --dbname="$POSTGRES_DB"' < "$BACKUP"
  docker compose up -d
)
```

The restore works with an empty fresh database or an existing database that is intentionally being replaced. `dropdb --force` disconnects database clients; stopping web and API first prevents application writes during restoration. The fail-fast subshell and `pg_restore --exit-on-error` prevent the final startup after a failed restore, leaving web and API stopped for investigation. On success, the final `up` starts the API, which applies any pending compatible migrations. Verify startup, log in with an account from the backup, and check its bookmarks.

## Reset an account's password

Signet v1 has no self-service or emailed password reset. An operator can use the existing account registration changeset to hash a new password and update the account directly. This also revokes all of that account's existing sessions. The new password must be 12–128 characters.

Run the following from the deployment directory. The password is read without echoing it and is not placed in the command line:

```sh
printf 'Account email: '
read -r RESET_EMAIL
printf 'New password (input hidden): '
stty -echo
read -r RESET_PASSWORD
stty echo
printf '\n'
export RESET_EMAIL RESET_PASSWORD
docker compose exec -e RESET_EMAIL -e RESET_PASSWORD api env -u PHX_SERVER /app/bin/signet eval '
  alias Signet.Repo
  alias Signet.Accounts.{Session, User}
  import Ecto.Query

  {:ok, _} = Application.ensure_all_started(:signet)
  email = User.normalize_email(System.fetch_env!("RESET_EMAIL"))
  password = System.fetch_env!("RESET_PASSWORD")
  user = Repo.get_by!(User, email: email)

  Repo.transaction(fn ->
    updated_user =
      user
      |> User.registration_changeset(%{"password" => password})
      |> Repo.update!()

    Repo.delete_all(from session in Session, where: session.user_id == ^updated_user.id)
  end)
'
unset RESET_EMAIL RESET_PASSWORD
```

A missing account, invalid password, or database error aborts the transaction. On success, the user must log in with the new password on every client. Do not set passwords directly in PostgreSQL: they must be Argon2id-hashed by the application.

## Storage and removal

Compose prefixes these named volumes with the project name, normally the deployment directory name:

| Volume | Contents | Consequence of deletion |
| --- | --- | --- |
| `db_data` | PostgreSQL database: accounts, sessions, and bookmarks | Permanent loss of all application data not present in a backup |
| `caddy_data` | Caddy certificates, keys, and ACME state | Caddy must obtain new certificates; external rate limits may apply |
| `caddy_config` | Caddy generated configuration state | Caddy recreates its local configuration state |

To stop services without deleting containers or volumes:

```sh
docker compose stop
```

To remove containers and the project network while retaining all data:

```sh
docker compose down
```

**Destructive cleanup:** the following permanently deletes all three volumes for the selected Compose project. Verify the project with `docker compose ps` and take a database backup first. Never run it against another project's directory or `COMPOSE_PROJECT_NAME`.

```sh
docker compose down --volumes
```

Host files in `backups/`, `.env`, and the Compose files are not deleted by Compose. Remove the deployment directory separately only when those files are no longer needed. Do not use a global Docker volume prune as a substitute for project-scoped cleanup.

## GHCR package visibility for maintainers

Anonymous installation requires public packages. After the first publish, a repository maintainer must open **both** `signet-api` and `signet-web` in the repository owner's GitHub **Packages**, then use **Package settings → Danger Zone → Change visibility → Public**. Repeat the check after transferring a package or changing its repository linkage.

Package visibility cannot be configured by Compose or the image-publishing workflow. Until both packages are public, new installations cannot anonymously run `docker compose pull`. Maintainers can test anonymous access with an empty Docker configuration rather than logging out of their normal registry session:

```sh
ANONYMOUS_DOCKER_CONFIG="$(mktemp -d)"
DOCKER_CONFIG="$ANONYMOUS_DOCKER_CONFIG" docker pull ghcr.io/christopher2k/signet-api:latest
DOCKER_CONFIG="$ANONYMOUS_DOCKER_CONFIG" docker pull ghcr.io/christopher2k/signet-web:latest
rm -rf "$ANONYMOUS_DOCKER_CONFIG"
```

Use a released version instead of `latest` when validating a specific release. Do not publish images solely to test an installation; release publishing remains part of the normal release workflow.
