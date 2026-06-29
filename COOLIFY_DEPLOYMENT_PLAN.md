# Coolify Deployment Feature Branch Plan

Branch name: `chore/coolify-deployment`

Goal: switch production deployment to Coolify building directly from the Gitea repository with the existing `Dockerfile`, and remove the old registry/SSH/manual Compose deployment path.

## Steps

1. Create the feature branch:

   ```bash
   git checkout -b chore/coolify-deployment
   ```

2. Remove old registry/SSH deployment:

   - Delete `.gitea/workflows/deploy.yml`.
   - Keep `.gitea/workflows/ci.yml` for pull request and push checks.

3. Remove old manual Docker Compose deployment files:

   - Delete `deploy/docker-compose.yml`.
   - Delete root `docker-compose.yml`.
   - Keep `Dockerfile`, because Coolify should build from it directly.

4. Update `README.md`:

   - Replace Docker Compose deployment docs with Coolify deployment docs.
   - Remove Gitea registry/deploy secrets documentation.
   - Document Coolify settings:
     - Build pack: Dockerfile
     - Dockerfile path: `Dockerfile`
     - Exposed port: `3000`
     - Persistent storage mount: `/app/data`
     - `DATABASE_URL=file:/app/data/espresso.db`
     - `ORIGIN=<production app URL>`

5. Update `AGENTS.md`:

   - Remove Docker Compose deployment/verification instructions.
   - Replace them with Coolify-oriented notes.
   - Keep the Node 26+ warning because `node:sqlite` still requires it.
   - Keep the `/app/data` persistence rule for Coolify.

6. Optional cleanup:

   - Add `.env.example`:

     ```env
     DATABASE_URL=file:./data/espresso.db
     ORIGIN=http://localhost:3000
     ```

7. Verify locally:

   ```bash
   npm install
   npm run check
   npm run build
   ```

8. Optionally verify the Dockerfile if Docker is available:

   ```bash
   docker build -t espresso-logger .
   ```

9. Configure Coolify after merge:

   - Create app from the Gitea repository.
   - Use Dockerfile build.
   - Set branch to `main`.
   - Set port to `3000`.
   - Add persistent storage at `/app/data`.
   - Add environment variables:
     - `DATABASE_URL=file:/app/data/espresso.db`
     - `ORIGIN=https://your-app-url`
   - Deploy from Coolify.

10. Commit the branch:

    ```bash
    git add COOLIFY_DEPLOYMENT_PLAN.md README.md AGENTS.md .gitea/workflows/deploy.yml deploy/docker-compose.yml docker-compose.yml
    git commit -m "chore: switch deployment docs to Coolify"
    ```

## Notes

- The app already uses `@sveltejs/adapter-node`, listens on `HOST=0.0.0.0`, and defaults to `PORT=3000` in the `Dockerfile`.
- The current database path for production containers should remain `file:/app/data/espresso.db`.
- Coolify must provide persistent storage for `/app/data` or the SQLite database will be lost when the container is recreated.
