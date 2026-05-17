# Acquitions API - Docker + Neon setup
This project supports two database modes:
- Development: `neondatabase/neon_local` in Docker Compose (ephemeral Neon branches).
- Production: direct Neon Cloud URL (`*.neon.tech`) injected through environment variables.

## Files added
- `Dockerfile`
- `docker-compose.dev.yml`
- `docker-compose.prod.yml`
- `.env.development`
- `.env.production`

## 1) Development (Neon Local)
1. Fill required values in `.env.development`:
   - `NEON_API_KEY`
   - `NEON_PROJECT_ID`
   - optional `PARENT_BRANCH_ID` (leave empty to branch from default branch)
2. Start dev stack:
   - `docker compose -f docker-compose.dev.yml up --build`
3. App runs at:
   - `http://localhost:3000`
4. The app uses:
   - `DATABASE_URL=postgres://neon:npg@neon-local:5432/neondb?sslmode=require`

How ephemeral branches work:
- `neon-local` creates an ephemeral branch on container start.
- With `DELETE_BRANCH=true`, the branch is deleted when container stops.
- Set `DELETE_BRANCH=false` if you want to preserve the branch.

## 2) Production (Neon Cloud)
1. Set real production secrets in `.env.production`:
   - `DATABASE_URL=postgres://...neon.tech...`
   - `ARCJET_KEY=...`
2. Start production stack:
   - `docker compose -f docker-compose.prod.yml up --build -d`

Important:
- No Neon Local proxy is used in production.
- `DATABASE_URL` must be provided by environment variables/secrets manager.

## 3) How DATABASE_URL switches between environments
- Dev compose file uses `.env.development` and points to `neon-local`.
- Prod compose file uses `.env.production` and points to Neon Cloud.
- App database client reads `process.env.DATABASE_URL` at runtime.
- `src/config/database.js` auto-configures Neon serverless HTTP endpoint for Neon Local hosts.

## 4) Common commands
- Stop development stack: `docker compose -f docker-compose.dev.yml down`
- Stop production stack: `docker compose -f docker-compose.prod.yml down`
