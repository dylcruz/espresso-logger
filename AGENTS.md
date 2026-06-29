# Agent Notes

## Runtime And Commands
- This app targets Node 26+ because server code imports Node's built-in `node:sqlite` in `src/lib/server/db.ts`.
- Local Node workflow, if Node 26+ is installed: `npm install`, `npm run check`, `npm run build`, `npm run dev`.
- Production deploys through Coolify building the root `Dockerfile` directly from Gitea.
- Optional Dockerfile verification, if Docker is available: `docker build -t espresso-logger .`.

## App Structure
- SvelteKit routes live under `src/routes`; shared server-only database access is centralized in `src/lib/server/db.ts`.
- There is no migration framework: `src/lib/server/db.ts` creates tables and indexes on startup with `CREATE TABLE IF NOT EXISTS`.
- Type shapes for persisted rows are in `src/lib/server/schema.ts`; keep SQL column aliases in `db.ts` aligned with those camelCase types.
- Global unit preference is loaded in `src/routes/+layout.server.ts` and passed to pages through layout data.

## Data Rules
- Persist weights as grams and temperatures as Celsius; convert display/input values through `src/lib/units.ts`.
- Coolify must persist SQLite data with storage mounted at `/app/data`; do not commit database files.
- The app is intentionally single-user and LAN-only; do not add auth unless asked.
- Photo uploads were intentionally deferred for a future iteration.
