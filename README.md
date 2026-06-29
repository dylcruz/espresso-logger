# Espresso Logger

A single-user, LAN-only espresso logbook for tracking coffees, Breville Barista Touch settings, drink recipes, and shot notes.

## Features

- Coffee catalog with brand, blend, roast, origin, process, and notes.
- Shot log with dose, yield, time, grind settings, temperature, rating, and tasting notes.
- Metric/imperial display toggle.
- SQLite storage in `./data/espresso.db`.
- Docker Compose deployment for homelab hosting.

Photo uploads are intentionally left for a future iteration.

## Local Development

Local runtime requires Node 26 or newer because the app uses Node's built-in `node:sqlite` module. Bun can install dependencies and run type checks, but it cannot run the app runtime because Bun does not implement `node:sqlite`.

```bash
npm install
npm run dev
```

Open `http://localhost:5173`.

With Bun installed, this check is useful:

```bash
bun install
bun run check
```

## Docker Deployment

```bash
docker compose up -d --build
```

Open `http://localhost:3000`.

If you access the app from another device, set `ORIGIN` to the exact URL you use in the browser:

```bash
ORIGIN=http://<your-server-ip>:3000 docker compose up -d --build
```

The database is stored at `./data/espresso.db`. Back up the `data` directory to preserve your logbook.

## Configuration

The app reads `DATABASE_URL` and `ORIGIN`. `DATABASE_URL` defaults to:

```text
file:./data/espresso.db
```

The provided Docker Compose file uses:

```text
file:/app/data/espresso.db
```

`ORIGIN` must match the browser URL for production Docker form submissions. Docker Compose defaults it to `http://localhost:3000`.

## Gitea CI/CD

Gitea Actions workflows live in `.gitea/workflows`:

- `ci.yml` runs on every push and pull request with Node 26, then runs `npm install`, `npm run check`, and `npm run build`.
- `deploy.yml` runs on every push to `main`, checks the app, builds the Docker image, pushes it to `gitea.dylancruz.me`, copies `deploy/docker-compose.yml` to the deployment server, and restarts the app over SSH.

Configure these repository secrets before enabling deployment:

- `REGISTRY_USERNAME`: Gitea registry username.
- `REGISTRY_TOKEN`: Gitea token or password with package publish/read access.
- `DEPLOY_HOST`: deployment server hostname or IP.
- `DEPLOY_USER`: SSH user on the deployment server.
- `DEPLOY_SSH_KEY`: private SSH key accepted by the deployment server.
- `DEPLOY_PATH`: directory on the deployment server, for example `/opt/espresso-logger`.
- `APP_ORIGIN`: production browser URL, for example `http://192.168.1.50:3000`.

The `deploy.yml` workflow must run on a Docker-capable Gitea runner with access to `docker`, `docker compose`, `ssh`, `scp`, `ssh-keyscan`, and `curl`. Use the default act runner if it already exposes those tools; otherwise, register a dedicated runner label backed by an image that includes them and update `runs-on` in `deploy.yml`.

The deployment workflow writes `${DEPLOY_PATH}/.env` with `IMAGE` and `ORIGIN`, then persists SQLite data in `${DEPLOY_PATH}/data` on the deployment server.
