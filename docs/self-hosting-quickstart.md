# Signet

## Local Docker quickstart

Requirements: Docker with Compose v2. No local Node.js, pnpm, Elixir, or PostgreSQL installation is needed.

1. Create the local environment file:

   ```sh
   cp .env.example .env
   ```

2. In `.env`, replace `POSTGRES_PASSWORD` and `SECRET_KEY_BASE` with local-only random values. Use URL-safe letters, numbers, hyphens, or underscores; the secret key base must be at least 64 characters. Keep `PHX_HOST=localhost` for the default local setup.

3. Build the API and web images and start the complete stack:

   ```sh
   docker compose up --build
   ```

4. Open <http://localhost:8080>. The web container serves the production frontend and proxies API requests and `/healthz` to the API. Direct navigation to SPA routes such as <http://localhost:8080/login> is supported. API readiness is available at <http://localhost:8080/healthz>.

PostgreSQL and Phoenix are only reachable on the Compose network; neither publishes a host port. PostgreSQL data is retained in the `db_data` named volume across container recreation. Migrations run automatically before Phoenix starts.

To use another local port, set `WEB_PORT` in `.env`. To stop the stack, press Ctrl+C or run `docker compose stop`. To remove the containers while retaining accounts and bookmarks, run `docker compose down`; add `--volumes` only when you intentionally want to delete the local database.

Production deployment, backups, upgrades, and image publishing are outside this local quickstart.
