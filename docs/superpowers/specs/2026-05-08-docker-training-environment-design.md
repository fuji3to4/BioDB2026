# BioDB2026 Docker Training Environment Design

## Problem

Create a new Docker-based training environment in `BioDB2026` that combines the useful parts of the existing `biodb-next` and `BioDB` setups. The environment should use PostgreSQL as the shared database, provide both a PHP/Apache backend and a Next.js frontend/backend workspace, allow Next.js-based API exercises in addition to the frontend, and keep Next.js development centered on VS Code Remote rather than automatic startup from Compose.

## Goals

- Provide a single `docker-compose.yml` for the training environment.
- Run PostgreSQL as the only database.
- Keep PHP directly accessible from a browser for existing exercises.
- Keep Next.js as the main frontend and development target.
- Support backend API exercises implemented in Next.js as well.
- Allow both PHP and Next.js to connect to the same PostgreSQL instance.
- Support SQL exercise files from a shared `SQL` directory.
- Keep the setup simple and intentionally training-oriented rather than production-grade.

## Non-Goals

- No reverse proxy unification.
- No production hardening, secrets management, or HTTPS setup.
- No requirement for PHP and Next.js to call each other over HTTP APIs.
- No automatic Next.js development server startup during `docker compose up`.

## Recommended Architecture

The environment uses three services in one Compose project:

1. `postgres`
2. `php`
3. `nextjs`

All services share the default Docker Compose network. `postgres` is the common database for both application runtimes. `php` remains directly reachable from the browser on port 80. `nextjs` exposes port 3000 but starts in an idle state so developers can attach through VS Code Remote and run `npm install`, `npm run dev`, or `npm run build` manually inside the container.

## Service Design

### postgres

- Based on the PostgreSQL container pattern already used in `biodb-next`
- Exposes port `5432`
- Mounts a named volume for persistent database storage
- Mounts `./SQL` into the container so training SQL files are available
- Uses simple training credentials similar to the existing examples
- Does not over-automate database creation beyond what is needed for exercises

### php

- Based on the Apache + PHP pattern already used in `BioDB`
- Exposes port `80`
- Mounts `./html` into the web root used by the container
- Connects to PostgreSQL over the internal Docker network
- Keeps browser-direct access for existing PHP exercises and samples

### nextjs

- Exists mainly as a development workspace container
- Exposes port `3000`
- Mounts the Next.js application source directory at `./my-app`
- Keeps `node_modules` and build artifacts inside container-managed volumes or container-local paths
- Uses an idle command such as `tail -f /dev/null` or `sleep infinity`
- Is intended to be opened via VS Code Remote, then started manually as needed

## Directory Layout

The new repository should be organized around the training environment rather than around either older project:

```text
BioDB2026/
├── docker/
│   ├── postgres/
│   ├── php/
│   └── nextjs/
├── SQL/
├── html/
├── my-app/
├── docker-compose.yml
└── README.md
```

`docker/postgres`, `docker/php`, and `docker/nextjs` hold service-specific Dockerfiles and helper files. `SQL` contains exercise SQL scripts. `html` contains browser-accessible PHP exercises. `my-app` contains the Next.js project used as the main frontend and as the base for Next.js API route exercises.

## Data Flow

- Browser requests PHP exercises through `http://localhost/`
- Browser requests Next.js through `http://localhost:3000/` when the dev server is started
- Browser or client-side code can also reach training APIs implemented in Next.js route handlers on the same service
- PHP connects directly to PostgreSQL using the Compose service name `postgres`
- Next.js connects directly to PostgreSQL using the Compose service name `postgres`
- SQL scripts are applied to the shared PostgreSQL instance using `docker exec` and `psql`

There is no mandatory HTTP dependency between PHP and Next.js. They coexist as separate learning surfaces backed by the same database, and Next.js can also host exercise APIs when needed.

## Development Workflow

### Initial startup

Run:

```bash
docker compose up -d
```

This starts:

- PostgreSQL in normal service mode
- PHP/Apache in normal service mode
- Next.js container in idle workspace mode

### Database initialization

Load training SQL manually with `docker exec` and `psql`, for example:

```bash
docker exec -i <postgres-container> psql -U user -d postgres -f /home/user/SQL/<file>.sql
```

This keeps the exercise flow explicit and easy to explain during class.

### Next.js development

1. Attach to the `nextjs` container from VS Code Remote
2. Install dependencies if needed
3. Run `npm run dev` manually during development
4. Run `npm run build` manually when needed

This matches the intended teaching workflow and avoids unnecessary auto-start behavior.

## Error Handling and Troubleshooting

The README should explicitly cover these cases:

1. PostgreSQL not initialized yet
2. Next.js dev server not started yet
3. Port conflicts on `80`, `3000`, or `5432`

Errors should be surfaced through normal container logs and application errors rather than hidden behind fallback behavior.

## Testing and Validation Expectations

The environment should be considered ready when all of the following are true:

- `docker compose up -d` starts all three services successfully
- PostgreSQL accepts connections from both PHP and Next.js containers
- A sample PHP page can connect to PostgreSQL and render in the browser
- The Next.js project can be opened in VS Code Remote and started manually
- The Next.js dev server becomes reachable on port 3000 after manual startup
- A sample Next.js API route can connect to PostgreSQL and respond correctly
- SQL training scripts can be applied from the shared `SQL` directory

## Rationale

This design keeps the environment easy to teach:

- It preserves direct PHP access for older exercise materials
- It makes Next.js the main frontend and an optional API exercise surface without forcing it into production-style orchestration
- It standardizes on PostgreSQL to match the newer project
- It keeps the runtime model simple enough for students to understand service boundaries

## Final Naming Decision

The Next.js project root will live in `my-app` to stay consistent with the earlier training environment and reduce friction when reusing existing examples. No architectural ambiguity remains.
