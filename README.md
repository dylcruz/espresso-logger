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

Open `http://<your-server-ip>:3000`.

The database is stored at `./data/espresso.db`. Back up the `data` directory to preserve your logbook.

## Configuration

The app reads `DATABASE_URL` and defaults to:

```text
file:./data/espresso.db
```

The provided Docker Compose file uses:

```text
file:/app/data/espresso.db
```
