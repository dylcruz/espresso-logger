# Agent Notes

## Runtime And Commands
- This app targets Node 26+ because server code imports Node's built-in `node:sqlite` in `src/lib/server/db.ts`.
- Bun can run `bun install` and `bun run check`, but do not use Bun for `dev`, `build`, or runtime: Bun does not provide `node:sqlite`.
- Local Node workflow, if Node 26+ is installed: `npm install`, `npm run check`, `npm run build`, `npm run dev`.
- Docker is the safest verification path: `docker compose build`, then `docker compose up -d` and check `http://localhost:3000`.
- If Docker fails with `docker-credential-desktop.exe` on this Linux/WSL host, run commands with `DOCKER_CONFIG=/tmp/opencode` instead of editing repo files.

## App Structure
- SvelteKit routes live under `src/routes`; shared server-only database access is centralized in `src/lib/server/db.ts`.
- There is no migration framework: `src/lib/server/db.ts` creates tables and indexes on startup with `CREATE TABLE IF NOT EXISTS`.
- Type shapes for persisted rows are in `src/lib/server/schema.ts`; keep SQL column aliases in `db.ts` aligned with those camelCase types.
- Global unit preference is loaded in `src/routes/+layout.server.ts` and passed to pages through layout data.

## Data Rules
- Persist weights as grams and temperatures as Celsius; convert display/input values through `src/lib/units.ts`.
- Docker Compose persists SQLite data in `./data` mounted to `/app/data`; do not commit database files.
- The app is intentionally single-user and LAN-only; do not add auth unless asked.
- Photo uploads were intentionally deferred for a future iteration.
