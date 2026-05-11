# BioDB2026 Docker Training Environment

This repository provides a training environment with PostgreSQL, PHP, and Next.js running in Docker Compose.

## Start the containers

```powershell
Set-Location 'E:\Data\App\BioDB2026\.worktrees\docker-training-environment'
docker compose up -d
```

This starts:

- PostgreSQL on `localhost:5432`
- PHP/Apache on `http://localhost/`
- Next.js container on `localhost:3000`

## PostgreSQL manual setup

The mounted SQL files are **manual exercise setup steps**. They are not applied automatically by `docker compose up -d`.

Run these commands from the repository root when you need the sample databases:

```powershell
Set-Location 'E:\Data\App\BioDB2026\.worktrees\docker-training-environment'
docker compose exec postgres psql -U user -d postgres -f /home/user/SQL/demo.sql
docker compose exec postgres psql -U user -d postgres -f /home/user/SQL/setting.sql
```

- `demo.sql` recreates the `demo` database for the bioinformatics exercises.
- `setting.sql` recreates the `database1` database for the SQL practice exercises.

## PHP pages

After the containers are running, open:

- `http://localhost/`
- `http://localhost/postgres.php`

The top page links to the PostgreSQL sample page, and `postgres.php` confirms PHP can connect to PostgreSQL.

## Next.js workflow

The `nextjs` container is prepared as a development container. Use VS Code Remote / Dev Containers to attach to the running `nextjs` container, then work in `/app`.

Inside the container:

```powershell
cp .env.example .env
npm install
npm run dev
```

Then open:

- `http://localhost:3000/`

Useful health check:

- `http://localhost:3000/api/health`

## Smoke test

After setup, run the final verification from the repository root:

```powershell
Set-Location 'E:\Data\App\BioDB2026\.worktrees\docker-training-environment'
docker compose ps
(Invoke-WebRequest 'http://localhost/').StatusCode
(Invoke-WebRequest 'http://localhost:3000/api/health').StatusCode
```

Expected result:

- `docker compose ps` shows `postgres`, `php`, and `nextjs` running
- `http://localhost/` returns `200`
- `http://localhost:3000/api/health` returns `200`

## Troubleshooting

### PostgreSQL is running but the exercise databases are missing

`demo.sql` and `setting.sql` are manual steps. If `demo` or `database1` does not exist, run the two `docker compose exec postgres ... -f /home/user/SQL/...` commands again.

If you recreated the containers without removing the PostgreSQL volume, Docker will keep the old database state.

### Next.js is not responding on port 3000

The `nextjs` container starts and waits for development work, but the app only responds after you attach with VS Code Remote, create `.env`, install packages, and run:

```powershell
npm run dev
```

You can verify the app with `http://localhost:3000/api/health`.

### Port conflict errors

This project expects these host ports:

- `80` for PHP
- `3000` for Next.js
- `5432` for PostgreSQL

If `docker compose up -d` fails because a port is already in use, stop the other service using that port or update the published port mapping in `docker-compose.yml` before retrying.
