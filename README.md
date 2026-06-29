# Espresso Logger

A single-user, LAN-only espresso logbook for tracking coffees, Breville Barista Touch settings, drink recipes, and shot notes.

## Features

- Coffee catalog with brand, blend, roast, origin, process, and notes.
- Shot log with dose, yield, time, grind settings, temperature, rating, and tasting notes.
- Metric/imperial display toggle.
- SQLite storage in `./data/espresso.db`.
- Coolify deployment for homelab hosting.

Photo uploads are intentionally left for a future iteration.

## Local Development

Local runtime requires Node 26 or newer because the app uses Node's built-in `node:sqlite` module.

```bash
npm install
npm run dev
```

Open `http://localhost:5173`.

## Coolify Deployment

Deploy the app in Coolify from the Gitea repository and let Coolify build the existing `Dockerfile` directly.

Use these Coolify settings:

- Build pack: Dockerfile
- Dockerfile path: `Dockerfile`
- Exposed port: `3000`
- Persistent storage mount: `/app/data`
- Environment variable: `DATABASE_URL=file:/app/data/espresso.db`
- Environment variable: `ORIGIN=<production app URL>`

`ORIGIN` must exactly match the URL used in the browser, for example `https://espresso.example.com`.

The production database is stored at `/app/data/espresso.db`. Configure persistent storage for `/app/data` in Coolify and back it up to preserve your logbook.

## Configuration

The app reads `DATABASE_URL` and `ORIGIN`. `DATABASE_URL` defaults to:

```text
file:./data/espresso.db
```

Production deployments should use:

```text
file:/app/data/espresso.db
```

`ORIGIN` must match the browser URL for production form submissions. For local development, it can be omitted or set to `http://localhost:3000` when running the built Node server.

## Gitea CI

Gitea Actions workflows live in `.gitea/workflows`:

- `ci.yml` runs on pushes to `main` and pull requests targeting `main` with Node 26, then runs `npm install`, `npm run check`, and `npm run build`.

Protect the `main` branch in Gitea and require the `check` job from the `CI` workflow before merging pull requests into `main`.
