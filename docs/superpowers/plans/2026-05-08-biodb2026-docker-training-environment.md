# BioDB2026 Docker Training Environment Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a new `BioDB2026` Docker environment with PostgreSQL, PHP/Apache, and a VS Code Remote-friendly Next.js workspace in `my-app`.

**Architecture:** The environment is assembled incrementally so each service works before the next one is added: first PostgreSQL, then PHP, then the Next.js workspace and sample API routes. `docker-compose.yml` is the single orchestration entry point, while `html` holds PHP exercises, `my-app` holds the Next.js project, and `SQL` holds shared training SQL loaded manually with `psql`.

**Tech Stack:** Docker Compose, PostgreSQL 17, PHP 8.3 + Apache, Node.js 22, Next.js 15, TypeScript, `pg`, VS Code Remote Containers

---

## File Structure Map

- Create: `.gitignore` — ignore Node/Next artifacts and local environment files
- Create: `docker-compose.yml` — defines `postgres`, `php`, and `nextjs`
- Create: `docker\postgres\Dockerfile` — PostgreSQL image with Japanese locale and init script
- Create: `docker\postgres\init.sql` — training-friendly PostgreSQL privileges
- Create: `docker\php\Dockerfile` — Apache/PHP image with PostgreSQL extensions
- Create: `docker\php\000-default.conf` — Apache document root config for mounted `html`
- Create: `docker\php\php.ini` — PHP dev settings for the exercise environment
- Create: `docker\nextjs\Dockerfile` — Node image that idles until VS Code Remote attaches
- Create: `html\index.php` — visible landing page linking to DB sample
- Create: `html\postgres.php` — PHP sample that connects to PostgreSQL
- Create: `my-app\` via `create-next-app` — Next.js app-router project root
- Modify: `my-app\package.json` — add `pg` dependency
- Create: `my-app\src\lib\db.ts` — shared PostgreSQL connection helper
- Create: `my-app\src\app\api\health\route.ts` — simple JSON health endpoint
- Create: `my-app\src\app\api\proteins\route.ts` — sample DB-backed API exercise
- Modify: `my-app\src\app\page.tsx` — simple landing page linking to the API route
- Create: `my-app\.env.example` — example env values for local and container dev
- Create: `README.md` — startup, SQL loading, VS Code Remote workflow, troubleshooting
- Copy: `SQL\demo.sql`, `SQL\setting.sql` — shared exercise SQL imported from the existing project

### Task 1: Bootstrap the repository skeleton

**Files:**
- Create: `.gitignore`
- Create: `docker-compose.yml`
- Create: `SQL\`
- Create: `docker\postgres\`
- Create: `docker\php\`
- Create: `docker\nextjs\`
- Create: `html\`
- Create: `my-app\`

- [ ] **Step 1: Initialize git and verify there is no Compose file yet**

Run:

```powershell
Set-Location 'E:\Data\App\BioDB2026'
git init
docker compose config
```

Expected: `git init` succeeds, then `docker compose config` fails with a message like `no configuration file provided`.

- [ ] **Step 2: Add the root ignore file**

Create `E:\Data\App\BioDB2026\.gitignore`:

```gitignore
node_modules/
.next/
my-app\node_modules\
my-app\.next\
.env
.env.*
!.env.example
dist/
coverage/
```

- [ ] **Step 3: Add a minimal Compose file with only the PostgreSQL service stub**

Create `E:\Data\App\BioDB2026\docker-compose.yml`:

```yaml
services:
  postgres:
    build: ./docker/postgres
    container_name: biodb2026-postgres
    ports:
      - "5432:5432"
    volumes:
      - pgdata:/var/lib/postgresql/data
      - ./SQL:/home/user/SQL
    environment:
      POSTGRES_USER: user
      POSTGRES_PASSWORD: password
    restart: always

volumes:
  pgdata:
```

- [ ] **Step 4: Verify Compose parses**

Run:

```powershell
Set-Location 'E:\Data\App\BioDB2026'
docker compose config
```

Expected: Compose renders normalized YAML and exits successfully.

- [ ] **Step 5: Commit**

```powershell
Set-Location 'E:\Data\App\BioDB2026'
git add .gitignore docker-compose.yml
git commit -m "chore: bootstrap biodb2026 docker workspace"
```

### Task 2: Add the PostgreSQL service

**Files:**
- Create: `docker\postgres\Dockerfile`
- Create: `docker\postgres\init.sql`
- Modify: `docker-compose.yml`
- Test: `docker compose build postgres`

- [ ] **Step 1: Verify the PostgreSQL image cannot build yet**

Run:

```powershell
Set-Location 'E:\Data\App\BioDB2026'
docker compose build postgres
```

Expected: FAIL because `docker\postgres\Dockerfile` does not exist yet.

- [ ] **Step 2: Add the PostgreSQL Dockerfile**

Create `E:\Data\App\BioDB2026\docker\postgres\Dockerfile`:

```dockerfile
FROM postgres:17

RUN apt-get update \
    && apt-get install -y locales \
    && sed -i -e 's/# ja_JP.UTF-8 UTF-8/ja_JP.UTF-8 UTF-8/' /etc/locale.gen \
    && locale-gen \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

ENV LANG=ja_JP.UTF-8
ENV LANGUAGE=ja_JP:ja
ENV LC_ALL=ja_JP.UTF-8

COPY ./init.sql /docker-entrypoint-initdb.d/01-init.sql

WORKDIR /home/user/SQL
```

- [ ] **Step 3: Add the PostgreSQL init script**

Create `E:\Data\App\BioDB2026\docker\postgres\init.sql`:

```sql
ALTER ROLE "user" SUPERUSER CREATEROLE CREATEDB REPLICATION BYPASSRLS;

GRANT ALL ON SCHEMA public TO PUBLIC;
GRANT ALL ON SCHEMA public TO "user";
```

- [ ] **Step 4: Add the database name so SQL exercises have a default target**

Update `E:\Data\App\BioDB2026\docker-compose.yml` service block to:

```yaml
services:
  postgres:
    build: ./docker/postgres
    container_name: biodb2026-postgres
    ports:
      - "5432:5432"
    volumes:
      - pgdata:/var/lib/postgresql/data
      - ./SQL:/home/user/SQL
    environment:
      POSTGRES_USER: user
      POSTGRES_PASSWORD: password
      POSTGRES_DB: postgres
    restart: always

volumes:
  pgdata:
```

- [ ] **Step 5: Build and smoke-test PostgreSQL**

Run:

```powershell
Set-Location 'E:\Data\App\BioDB2026'
docker compose build postgres
docker compose up -d postgres
docker compose exec postgres psql -U user -d postgres -c "\conninfo"
```

Expected: image build succeeds, container starts, and `psql` prints a successful connection summary.

- [ ] **Step 6: Commit**

```powershell
Set-Location 'E:\Data\App\BioDB2026'
git add docker-compose.yml docker\postgres\Dockerfile docker\postgres\init.sql
git commit -m "feat: add postgres service"
```

### Task 3: Add the PHP/Apache service

**Files:**
- Create: `docker\php\Dockerfile`
- Create: `docker\php\000-default.conf`
- Create: `docker\php\php.ini`
- Create: `html\index.php`
- Create: `html\postgres.php`
- Modify: `docker-compose.yml`
- Test: `docker compose build php`

- [ ] **Step 1: Verify the PHP image cannot build yet**

Run:

```powershell
Set-Location 'E:\Data\App\BioDB2026'
docker compose build php
```

Expected: FAIL because the `php` service is not in `docker-compose.yml` yet.

- [ ] **Step 2: Expand Compose to include the PHP service**

Update `E:\Data\App\BioDB2026\docker-compose.yml` to:

```yaml
services:
  postgres:
    build: ./docker/postgres
    container_name: biodb2026-postgres
    ports:
      - "5432:5432"
    volumes:
      - pgdata:/var/lib/postgresql/data
      - ./SQL:/home/user/SQL
    environment:
      POSTGRES_USER: user
      POSTGRES_PASSWORD: password
      POSTGRES_DB: postgres
    restart: always

  php:
    build: ./docker/php
    container_name: biodb2026-php
    ports:
      - "80:80"
    volumes:
      - ./html:/html
    depends_on:
      - postgres
    restart: always

volumes:
  pgdata:
```

- [ ] **Step 3: Add the PHP Dockerfile and Apache config**

Create `E:\Data\App\BioDB2026\docker\php\Dockerfile`:

```dockerfile
FROM php:8.3-apache-bookworm

ENV TZ=Asia/Tokyo

COPY php.ini /usr/local/etc/php/
COPY 000-default.conf /etc/apache2/sites-available/000-default.conf

RUN apt-get update \
    && apt-get install -y libpq-dev libonig-dev \
    && docker-php-ext-install pdo_pgsql pgsql mbstring \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /html
RUN rm -rf /var/www/html
RUN ln -s /html /var/www/html
```

Create `E:\Data\App\BioDB2026\docker\php\000-default.conf`:

```apache
<VirtualHost *:80>
    DocumentRoot /var/www/html

    <Directory /var/www/html>
        Options Indexes FollowSymLinks
        AllowOverride None
        Require all granted
    </Directory>

    ErrorLog ${APACHE_LOG_DIR}/error.log
    CustomLog ${APACHE_LOG_DIR}/access.log combined
</VirtualHost>
```

- [ ] **Step 4: Add PHP runtime settings and the browser-visible sample pages**

Create `E:\Data\App\BioDB2026\docker\php\php.ini`:

```ini
display_errors=On
error_reporting=E_ALL
date.timezone=Asia/Tokyo
```

Create `E:\Data\App\BioDB2026\html\index.php`:

```php
<?php
?>
<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <title>BioDB2026 PHP</title>
</head>
<body>
    <h1>BioDB2026 PHP Exercise</h1>
    <ul>
        <li><a href="/postgres.php">PostgreSQL connection sample</a></li>
    </ul>
</body>
</html>
```

Create `E:\Data\App\BioDB2026\html\postgres.php`:

```php
<?php
$dsn = 'pgsql:host=postgres;port=5432;dbname=postgres';
$user = 'user';
$password = 'password';

try {
    $pdo = new PDO($dsn, $user, $password, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
    ]);
    $result = $pdo->query('SELECT current_database() AS db_name')->fetch(PDO::FETCH_ASSOC);
} catch (PDOException $e) {
    http_response_code(500);
    echo 'Database connection failed: ' . htmlspecialchars($e->getMessage(), ENT_QUOTES, 'UTF-8');
    exit;
}
?>
<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <title>PHP PostgreSQL Sample</title>
</head>
<body>
    <h1>PHP PostgreSQL Sample</h1>
    <p>Connected database: <?php echo htmlspecialchars($result['db_name'], ENT_QUOTES, 'UTF-8'); ?></p>
</body>
</html>
```

- [ ] **Step 5: Build and verify the PHP sample page**

Run:

```powershell
Set-Location 'E:\Data\App\BioDB2026'
docker compose build php
docker compose up -d
(Invoke-WebRequest 'http://localhost/postgres.php').Content
```

Expected: build succeeds and the response HTML contains `Connected database: postgres`.

- [ ] **Step 6: Commit**

```powershell
Set-Location 'E:\Data\App\BioDB2026'
git add docker-compose.yml docker\php\Dockerfile docker\php\000-default.conf docker\php\php.ini html\index.php html\postgres.php
git commit -m "feat: add php postgres sample"
```

### Task 4: Add the Next.js workspace container and application skeleton

**Files:**
- Create: `docker\nextjs\Dockerfile`
- Create: `my-app\` via `create-next-app`
- Create: `my-app\.env.example`
- Modify: `my-app\package.json`
- Modify: `docker-compose.yml`
- Test: `docker compose build nextjs`

- [ ] **Step 1: Verify the Next.js service does not exist yet**

Run:

```powershell
Set-Location 'E:\Data\App\BioDB2026'
docker compose build nextjs
```

Expected: FAIL because the `nextjs` service is not in `docker-compose.yml` yet.

- [ ] **Step 2: Scaffold the Next.js app in `my-app`**

Run:

```powershell
Set-Location 'E:\Data\App\BioDB2026'
npx create-next-app@latest my-app --ts --eslint --app --src-dir --use-npm --yes
```

Expected: the generator creates `my-app\package.json`, `my-app\src\app\page.tsx`, and the standard Next.js app-router structure.

- [ ] **Step 3: Add the workspace container image**

Create `E:\Data\App\BioDB2026\docker\nextjs\Dockerfile`:

```dockerfile
FROM node:22-slim

WORKDIR /app

CMD ["tail", "-f", "/dev/null"]
```

- [ ] **Step 4: Add the PostgreSQL client dependency and environment example**

Run:

```powershell
Set-Location 'E:\Data\App\BioDB2026\my-app'
npm install pg
```

Expected: `package.json` and `package-lock.json` are updated to include `pg`.

Create `E:\Data\App\BioDB2026\my-app\.env.example`:

```env
DATABASE_URL=postgresql://user:password@postgres:5432/postgres
```

- [ ] **Step 5: Expand Compose to include the idle Next.js workspace**

Update `E:\Data\App\BioDB2026\docker-compose.yml` to:

```yaml
services:
  postgres:
    build: ./docker/postgres
    container_name: biodb2026-postgres
    ports:
      - "5432:5432"
    volumes:
      - pgdata:/var/lib/postgresql/data
      - ./SQL:/home/user/SQL
    environment:
      POSTGRES_USER: user
      POSTGRES_PASSWORD: password
      POSTGRES_DB: postgres
    restart: always

  php:
    build: ./docker/php
    container_name: biodb2026-php
    ports:
      - "80:80"
    volumes:
      - ./html:/html
    depends_on:
      - postgres
    restart: always

  nextjs:
    build: ./docker/nextjs
    container_name: biodb2026-nextjs
    working_dir: /app
    ports:
      - "3000:3000"
    volumes:
      - ./my-app:/app
      - /app/node_modules
      - /app/.next
    depends_on:
      - postgres
    environment:
      WATCHPACK_POLLING: "true"
      CHOKIDAR_USEPOLLING: "true"
    tty: true
    restart: always

volumes:
  pgdata:
```

- [ ] **Step 6: Install dependencies and verify the workspace image builds**

Run:

```powershell
Set-Location 'E:\Data\App\BioDB2026\my-app'
npm install
Set-Location 'E:\Data\App\BioDB2026'
docker compose build nextjs
docker compose up -d nextjs
docker compose exec nextjs node -v
```

Expected: `npm install` adds `pg`, the image builds, the container starts, and `node -v` prints a Node 22 version.

- [ ] **Step 7: Commit**

```powershell
Set-Location 'E:\Data\App\BioDB2026'
git add docker-compose.yml docker\nextjs\Dockerfile my-app my-app\.env.example
git commit -m "feat: add nextjs workspace container"
```

### Task 5: Add shared PostgreSQL examples for Next.js

**Files:**
- Create: `my-app\src\lib\db.ts`
- Create: `my-app\src\app\api\health\route.ts`
- Create: `my-app\src\app\api\proteins\route.ts`
- Modify: `my-app\src\app\page.tsx`
- Modify: `my-app\.env.example`
- Modify: `docker-compose.yml`
- Copy: `SQL\demo.sql`
- Copy: `SQL\setting.sql`
- Test: `npm run build`

- [ ] **Step 1: Verify the generated app has no shared DB helper or exercise API routes yet**

Run:

```powershell
Set-Location 'E:\Data\App\BioDB2026\my-app'
Test-Path '.\src\lib\db.ts'
Test-Path '.\src\app\api\proteins\route.ts'
```

Expected: both commands print `False`.

- [ ] **Step 2: Copy the shared SQL exercises into the new workspace**

Run:

```powershell
Set-Location 'E:\Data\App\BioDB2026'
Copy-Item 'E:\Data\App\biodb-next\SQL\demo.sql' '.\SQL\demo.sql'
Copy-Item 'E:\Data\App\biodb-next\SQL\setting.sql' '.\SQL\setting.sql'
```

Expected: both SQL files now exist under `E:\Data\App\BioDB2026\SQL\`.

- [ ] **Step 3: Add the Next.js PostgreSQL helper and API routes**

Create `E:\Data\App\BioDB2026\my-app\src\lib\db.ts`:

```ts
import { Pool } from "pg";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not set");
}

const globalForDb = globalThis as typeof globalThis & {
  biodbPool?: Pool;
};

export const pool =
  globalForDb.biodbPool ??
  new Pool({
    connectionString,
  });

if (process.env.NODE_ENV !== "production") {
  globalForDb.biodbPool = pool;
}
```

Create `E:\Data\App\BioDB2026\my-app\src\app\api\health\route.ts`:

```ts
import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ status: "ok" });
}
```

Create `E:\Data\App\BioDB2026\my-app\src\app\api\proteins\route.ts`:

```ts
import { NextResponse } from "next/server";
import { pool } from "@/lib/db";

export async function GET() {
  const result = await pool.query(
    "SELECT proteinID, name, organism, len, fav FROM Protein ORDER BY proteinID LIMIT 10"
  );

  return NextResponse.json({
    count: result.rows.length,
    proteins: result.rows,
  });
}
```

- [ ] **Step 4: Replace the default page with a training landing page**

Update `E:\Data\App\BioDB2026\my-app\src\app\page.tsx` to:

```tsx
export default function Home() {
  return (
    <main style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h1>BioDB2026 Next.js Exercise</h1>
      <ul>
        <li><a href="/api/health">GET /api/health</a></li>
        <li><a href="/api/proteins">GET /api/proteins</a></li>
      </ul>
      <p>Start this app from the container with <code>npm run dev</code>.</p>
    </main>
  );
}
```

- [ ] **Step 5: Point Next.js at the exercise database**

Update `E:\Data\App\BioDB2026\my-app\.env.example` to:

```env
DATABASE_URL=postgresql://user:password@postgres:5432/demo
```

Update the `nextjs` service in `E:\Data\App\BioDB2026\docker-compose.yml` to:

```yaml
  nextjs:
    build: ./docker/nextjs
    container_name: biodb2026-nextjs
    working_dir: /app
    ports:
      - "3000:3000"
    volumes:
      - ./my-app:/app
      - /app/node_modules
      - /app/.next
    depends_on:
      - postgres
    environment:
      DATABASE_URL: postgresql://user:password@postgres:5432/demo
      WATCHPACK_POLLING: "true"
      CHOKIDAR_USEPOLLING: "true"
    tty: true
    restart: always
```

- [ ] **Step 6: Build the app and verify the API routes after starting dev mode**

Run:

```powershell
Set-Location 'E:\Data\App\BioDB2026'
docker compose exec nextjs npm run build
docker compose exec nextjs sh -lc "cp .env.example .env && npm run dev > /tmp/next.log 2>&1 &"
Start-Sleep -Seconds 10
(Invoke-WebRequest 'http://localhost:3000/api/health').Content
```

Expected: build succeeds and the JSON response contains `{"status":"ok"}`.

- [ ] **Step 7: Load sample SQL and verify the DB-backed API**

Run:

```powershell
Set-Location 'E:\Data\App\BioDB2026'
docker compose exec -T postgres psql -U user -d postgres -f /home/user/SQL/demo.sql
(Invoke-WebRequest 'http://localhost:3000/api/proteins').Content
```

Expected: SQL loads successfully and the response JSON contains a non-empty `proteins` array.

- [ ] **Step 8: Commit**

```powershell
Set-Location 'E:\Data\App\BioDB2026'
git add docker-compose.yml SQL\demo.sql SQL\setting.sql my-app\.env.example my-app\package.json my-app\src\lib\db.ts my-app\src\app\api\health\route.ts my-app\src\app\api\proteins\route.ts my-app\src\app\page.tsx
git commit -m "feat: add nextjs postgres exercise routes"
```

### Task 6: Document the exercise workflow and final verification

**Files:**
- Create: `README.md`
- Test: `docker compose ps`

- [ ] **Step 1: Verify the README does not exist yet**

Run:

```powershell
Set-Location 'E:\Data\App\BioDB2026'
Test-Path '.\README.md'
```

Expected: `False`.

- [ ] **Step 2: Write the README**

Create `E:\Data\App\BioDB2026\README.md`:

````markdown
# BioDB2026

PostgreSQL + PHP + Next.js を使う演習用 Docker 環境です。

## 起動

```bash
docker compose up -d
```

## PostgreSQL 初期化

```bash
docker compose exec -T postgres psql -U user -d postgres -f /home/user/SQL/demo.sql
docker compose exec -T postgres psql -U user -d postgres -f /home/user/SQL/setting.sql
```

## PHP

- `http://localhost/`
- `http://localhost/postgres.php`

## Next.js

1. VS Code Remote で `nextjs` コンテナへ接続
2. `cd /app`
3. `cp .env.example .env`
4. `npm install`
5. `npm run dev`
6. `http://localhost:3000/` を開く

## トラブルシューティング

### PostgreSQL が未初期化

`demo.sql` または `setting.sql` を `psql` で流してください。

### Next.js が開かない

`nextjs` コンテナに接続して `npm run dev` を実行してください。

### ポート競合

80 / 3000 / 5432 を使用している別プロセスを停止するか、`docker-compose.yml` の公開ポートを変更してください。
````

- [ ] **Step 3: Run the final smoke test**

Run:

```powershell
Set-Location 'E:\Data\App\BioDB2026'
docker compose ps
(Invoke-WebRequest 'http://localhost/').StatusCode
(Invoke-WebRequest 'http://localhost:3000/api/health').StatusCode
```

Expected: `docker compose ps` shows all three services running, and both HTTP status codes are `200`.

- [ ] **Step 4: Commit**

```powershell
Set-Location 'E:\Data\App\BioDB2026'
git add README.md
git commit -m "docs: add biodb2026 setup guide"
```

## Self-Review Notes

- Spec coverage: PostgreSQL, PHP direct access, idle Next.js workspace, shared SQL, VS Code Remote workflow, troubleshooting, and Next.js API exercises are all mapped to tasks.
- Placeholder scan: no `TBD`, `TODO`, or deferred implementation markers remain.
- Type consistency: the plan consistently uses `my-app`, `postgres`, `DATABASE_URL`, and the same service names across Compose, PHP, and Next.js tasks.
