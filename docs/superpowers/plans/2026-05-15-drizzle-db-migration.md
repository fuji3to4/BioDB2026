# Drizzle DB Migration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace direct `pg` usage in `my-app\src` with a single Drizzle-based `db` entry point while keeping all queries as explicit `db.execute(sql\`...\`)` statements.

**Architecture:** Keep the migration intentionally small. `src\lib\db.ts` becomes the only place that knows about `Pool` and `DATABASE_URL`, while `src\lib\pdb.ts`, `src\lib\proteins.ts`, and `src\app\search-pdb-simple\page.tsx` execute raw Drizzle SQL directly. Existing validation helpers stay in place, and tests move from `{ text, values }` assertions to behavior- and SQL-shape checks around the public functions.

**Tech Stack:** Next.js App Router, TypeScript, node:test, PostgreSQL via `pg`, Drizzle ORM (`drizzle-orm`, `drizzle-orm/node-postgres`)

---

## File Structure

- **Modify:** `my-app\package.json:13-37`
  - Add the `drizzle-orm` runtime dependency.
- **Modify:** `my-app\package-lock.json`
  - Capture the installed Drizzle dependency.
- **Modify:** `my-app\src\lib\db.ts:1-41`
  - Replace the exported `pool` proxy with a lazy Drizzle `db` proxy.
- **Create:** `my-app\src\lib\db.test.mts`
  - Prove that importing the DB module does not require `DATABASE_URL` until the connection is actually used.
- **Modify:** `my-app\src\lib\pdb.ts:1-60`
  - Remove query-object builders and execute raw Drizzle SQL inline.
- **Modify:** `my-app\src\lib\pdb.test.mts:1-49`
  - Replace query-builder tests with `db.execute(sql\`...\`)` call-shape tests.
- **Modify:** `my-app\src\lib\proteins.ts:1-56`
  - Remove query-object builders and execute raw Drizzle SQL inline.
- **Modify:** `my-app\src\lib\proteins.test.mts:1-40`
  - Replace query-builder tests with `db.execute(sql\`...\`)` call-shape tests.
- **Create:** `my-app\src\lib\db-usage.test.mts`
  - Guard against raw `pg` usage reappearing outside `src\lib\db.ts`.
- **Modify:** `my-app\src\app\search-pdb-simple\page.tsx:1-65`
  - Stop creating a route-local `Pool` and use the shared Drizzle `db`.

## Task 1: Add the shared Drizzle DB entry point

**Files:**
- Modify: `my-app\package.json:13-37`
- Modify: `my-app\package-lock.json`
- Modify: `my-app\src\lib\db.ts:1-41`
- Create: `my-app\src\lib\db.test.mts`
- Test: `my-app\src\lib\db.test.mts`

- [ ] **Step 1: Write the failing test**

```ts
import assert from "node:assert/strict";
import test from "node:test";

test("db module can be imported before DATABASE_URL is set", async () => {
  const original = process.env.DATABASE_URL;
  delete process.env.DATABASE_URL;

  try {
    const { db } = await import(`./db.ts?case=${Date.now()}`);
    assert.equal(typeof db.execute, "function");
  } finally {
    if (original === undefined) {
      delete process.env.DATABASE_URL;
    } else {
      process.env.DATABASE_URL = original;
    }
  }
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd my-app && node --test src/lib/db.test.mts`

Expected: FAIL because `src\lib\db.ts` exports `pool`, not `db`.

- [ ] **Step 3: Install Drizzle and update the lockfile**

Run: `cd my-app && npm install drizzle-orm`

Expected: `package.json` and `package-lock.json` change, and npm reports 1 package added with no install errors.

- [ ] **Step 4: Rewrite the DB module**

```ts
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

type Database = ReturnType<typeof drizzle>;

const globalForDb = globalThis as typeof globalThis & {
  biodbPool?: Pool;
  biodbDb?: Database;
};

let dbInstance: Database | undefined;

function getDb(): Database {
  if (dbInstance) {
    return dbInstance;
  }

  if (globalForDb.biodbDb) {
    dbInstance = globalForDb.biodbDb;
    return dbInstance;
  }

  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL is not set");
  }

  const pool =
    globalForDb.biodbPool ??
    new Pool({
      connectionString,
    });

  globalForDb.biodbPool = pool;
  dbInstance = drizzle(pool);

  if (process.env.NODE_ENV !== "production") {
    globalForDb.biodbDb = dbInstance;
  }

  return dbInstance;
}

export const db = new Proxy({} as Database, {
  get(_target, property, receiver) {
    const instance = getDb();
    const value = Reflect.get(instance, property, receiver);
    return typeof value === "function" ? value.bind(instance) : value;
  },
}) as Database;
```

- [ ] **Step 5: Run test to verify it passes**

Run: `cd my-app && node --test src/lib/db.test.mts`

Expected: PASS with 1 passing test.

- [ ] **Step 6: Commit**

```bash
git add my-app/package.json my-app/package-lock.json my-app/src/lib/db.ts my-app/src/lib/db.test.mts
git commit -m "feat: add drizzle db entry point"
```

## Task 2: Migrate PDB queries to `db.execute(sql\`...\`)`

**Files:**
- Modify: `my-app\src\lib\pdb.ts:1-60`
- Modify: `my-app\src\lib\pdb.test.mts:1-49`
- Test: `my-app\src\lib\pdb.test.mts`

- [ ] **Step 1: Replace the test file with failing Drizzle-SQL tests**

```ts
import assert from "node:assert/strict";
import test, { afterEach, mock } from "node:test";
import type { SQL } from "drizzle-orm";

import { db } from "./db.ts";
import { fetchPdbDetail, fetchPdbSearchResults, formatResolutionAngstrom } from "./pdb.ts";

function render(statement: SQL) {
  return statement.toQuery({
    casing: {} as never,
    escapeName: (value) => `"${value}"`,
    escapeParam: (index) => `$${index + 1}`,
    escapeString: (value) => `'${value.replaceAll("'", "''")}'`,
  });
}

afterEach(() => {
  mock.restoreAll();
});

test("fetchPdbSearchResults sends method and optional resolution through raw drizzle sql", async () => {
  const execute = mock.method(db, "execute", async () => ({ rows: [] }));

  await fetchPdbSearchResults({
    id: "1abc",
    method: "X-RAY",
    name: "",
    className: "Enzyme",
    organism: "",
    resolution: 2.2,
  });

  assert.equal(execute.mock.calls.length, 1);

  const statement = execute.mock.calls[0]!.arguments[0] as SQL;
  const rendered = render(statement);

  assert.match(rendered.sql, /pdb\.pdbid like '%' \|\| \$1 \|\| '%'/i);
  assert.match(rendered.sql, /pdb\.method like '%' \|\| \$2 \|\| '%'/i);
  assert.match(rendered.sql, /pdb\.resolution <= \$6/i);
  assert.deepEqual(rendered.params, ["1abc", "X-RAY", "", "Enzyme", "", 2.2]);
});

test("fetchPdbDetail uses exact-match pdbid lookup and returns the first row", async () => {
  const execute = mock.method(db, "execute", async () => ({
    rows: [{ pdbid: "1GUU", method: "X-RAY" }],
  }));

  const detail = await fetchPdbDetail("1GUU");

  assert.deepEqual(detail, { pdbid: "1GUU", method: "X-RAY" });

  const statement = execute.mock.calls[0]!.arguments[0] as SQL;
  const rendered = render(statement);

  assert.match(rendered.sql, /where \(pdb\.pdbid = \$1\)/i);
  assert.doesNotMatch(rendered.sql, /like '%' \|\|/i);
  assert.deepEqual(rendered.params, ["1GUU"]);
});

test("formatResolutionAngstrom formats correctly", () => {
  assert.equal(formatResolutionAngstrom(2.3456), "2.35 Å");
});

test("formatResolutionAngstrom handles null and undefined", () => {
  assert.equal(formatResolutionAngstrom(null), "");
  assert.equal(formatResolutionAngstrom(undefined), "");
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd my-app && node --test src/lib/pdb.test.mts`

Expected: FAIL because `fetchPdbSearchResults()` and `fetchPdbDetail()` still call `pool.query(...)`, and the tests now expect `db.execute(...)`.

- [ ] **Step 3: Rewrite `src\lib\pdb.ts` to execute raw Drizzle SQL inline**

```ts
import { sql } from "drizzle-orm";

import { db } from "./db.ts";
import type { SearchFilters } from "./search-filters.ts";

type PdbSearchRow = {
  pdbid: string;
  method: string;
  resolution: number | string | null;
  class: string;
  name: string;
  organism: string;
};

type PdbDetailRow = {
  pdbid: string;
  method: string;
  resolution: number | string | null;
  chain: string | null;
  positions: string | null;
  deposited: string | null;
  class: string;
  url: string | null;
  name: string;
  organism: string;
  len: number | null;
};

export async function fetchPdbSearchResults(filters: SearchFilters) {
  const result = await db.execute(sql`
    select pdb.pdbid, pdb.method, pdb.resolution, pdb.class, protein.name, protein.organism
    from pdb
    inner join pdb2protein on pdb.pdbid = pdb2protein.pdbid
    inner join protein on pdb2protein.proteinid = protein.proteinid
    where (pdb.pdbid like '%' || ${filters.id} || '%')
      and (pdb.method like '%' || ${filters.method} || '%')
      and (protein.name like '%' || ${filters.name} || '%')
      and (pdb.class like '%' || ${filters.className} || '%')
      and (protein.organism like '%' || ${filters.organism} || '%')
      ${filters.resolution === null ? sql`` : sql`and (pdb.resolution <= ${filters.resolution})`}
  `);

  return result.rows as PdbSearchRow[];
}

export async function fetchPdbDetail(pdbid: string) {
  const result = await db.execute(sql`
    select pdb.pdbid, pdb.method, pdb.resolution, pdb.chain, pdb.positions,
           to_char(pdb.deposited, 'YYYY-MM-DD') as deposited, pdb.class, pdb.url,
           protein.name, protein.organism, protein.len
    from pdb
    inner join pdb2protein on pdb.pdbid = pdb2protein.pdbid
    inner join protein on pdb2protein.proteinid = protein.proteinid
    where (pdb.pdbid = ${pdbid})
  `);

  return (result.rows[0] ?? null) as PdbDetailRow | null;
}

export function formatResolutionAngstrom(resolution: number | string | null | undefined) {
  if (resolution === null || resolution === undefined) return "";
  const n = Number(resolution);
  return Number.isFinite(n) ? `${n.toFixed(2)} Å` : "";
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `cd my-app && node --test src/lib/pdb.test.mts`

Expected: PASS with 4 passing tests.

- [ ] **Step 5: Commit**

```bash
git add my-app/src/lib/pdb.ts my-app/src/lib/pdb.test.mts
git commit -m "refactor: move pdb queries to drizzle sql"
```

## Task 3: Migrate protein queries to `db.execute(sql\`...\`)`

**Files:**
- Modify: `my-app\src\lib\proteins.ts:1-56`
- Modify: `my-app\src\lib\proteins.test.mts:1-40`
- Test: `my-app\src\lib\proteins.test.mts`

- [ ] **Step 1: Replace the test file with failing Drizzle-SQL tests**

```ts
import assert from "node:assert/strict";
import test, { afterEach, mock } from "node:test";
import type { SQL } from "drizzle-orm";

import { db } from "./db.ts";
import { createProtein, deleteProtein, fetchProteins, incrementProteinFav } from "./proteins.ts";

function render(statement: SQL) {
  return statement.toQuery({
    casing: {} as never,
    escapeName: (value) => `"${value}"`,
    escapeParam: (index) => `$${index + 1}`,
    escapeString: (value) => `'${value.replaceAll("'", "''")}'`,
  });
}

afterEach(() => {
  mock.restoreAll();
});

test("fetchProteins selects protein rows in id order", async () => {
  const execute = mock.method(db, "execute", async () => ({ rows: [] }));

  await fetchProteins();

  const statement = execute.mock.calls[0]!.arguments[0] as SQL;
  const rendered = render(statement);

  assert.match(rendered.sql, /select proteinid, name, organism, len, fav from protein order by proteinid/i);
  assert.deepEqual(rendered.params, []);
});

test("createProtein inserts name organism len and default fav", async () => {
  const execute = mock.method(db, "execute", async () => ({ rows: [] }));

  await createProtein({
    name: "Myoglobin",
    organism: "Human",
    length: 154,
  });

  const statement = execute.mock.calls[0]!.arguments[0] as SQL;
  const rendered = render(statement);

  assert.match(rendered.sql, /insert into protein\(name, organism, len, fav\) values \(\$1, \$2, \$3, 0\)/i);
  assert.deepEqual(rendered.params, ["Myoglobin", "Human", 154]);
});

test("incrementProteinFav and deleteProtein target proteinid", async () => {
  const execute = mock.method(db, "execute", async () => ({ rows: [] }));

  await incrementProteinFav(7);
  await deleteProtein(7);

  const updateRendered = render(execute.mock.calls[0]!.arguments[0] as SQL);
  const deleteRendered = render(execute.mock.calls[1]!.arguments[0] as SQL);

  assert.match(updateRendered.sql, /update protein set fav = fav \+ 1 where proteinid = \$1/i);
  assert.deepEqual(updateRendered.params, [7]);
  assert.match(deleteRendered.sql, /delete from protein where proteinid = \$1/i);
  assert.deepEqual(deleteRendered.params, [7]);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd my-app && node --test src/lib/proteins.test.mts`

Expected: FAIL because `src\lib\proteins.ts` still exports query-builder helpers and calls `pool.query(...)`.

- [ ] **Step 3: Rewrite `src\lib\proteins.ts` to execute raw Drizzle SQL inline**

```ts
import { sql } from "drizzle-orm";

import { db } from "./db.ts";
import type { ProteinInput } from "./protein-form.ts";

export type ProteinRow = {
  proteinid: number;
  name: string;
  organism: string;
  len: number;
  fav: number;
};

export async function fetchProteins() {
  const result = await db.execute(sql`
    select proteinid, name, organism, len, fav
    from protein
    order by proteinid
  `);

  return result.rows as ProteinRow[];
}

export async function createProtein(input: ProteinInput) {
  await db.execute(sql`
    insert into protein(name, organism, len, fav)
    values (${input.name}, ${input.organism}, ${input.length}, 0)
  `);
}

export async function incrementProteinFav(proteinId: number) {
  await db.execute(sql`
    update protein
    set fav = fav + 1
    where proteinid = ${proteinId}
  `);
}

export async function deleteProtein(proteinId: number) {
  await db.execute(sql`
    delete from protein
    where proteinid = ${proteinId}
  `);
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `cd my-app && node --test src/lib/proteins.test.mts`

Expected: PASS with 3 passing tests.

- [ ] **Step 5: Commit**

```bash
git add my-app/src/lib/proteins.ts my-app/src/lib/proteins.test.mts
git commit -m "refactor: move protein queries to drizzle sql"
```

## Task 4: Remove the last route-local `pg` usage and lock it down

**Files:**
- Create: `my-app\src\lib\db-usage.test.mts`
- Modify: `my-app\src\app\search-pdb-simple\page.tsx:1-65`
- Test: `my-app\src\lib\db-usage.test.mts`

- [ ] **Step 1: Add a failing regression test for forbidden raw `pg` usage**

```ts
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import test from "node:test";

const cases = [
  "src/lib/pdb.ts",
  "src/lib/proteins.ts",
  "src/app/search-pdb-simple/page.tsx",
];

for (const file of cases) {
  test(`${file} uses drizzle db.execute(sql) instead of raw pg`, () => {
    const source = readFileSync(resolve(process.cwd(), file), "utf8");

    assert.doesNotMatch(source, /new Pool\(/);
    assert.doesNotMatch(source, /pool\.query\(/);
    assert.doesNotMatch(source, /from "pg"/);
    assert.match(source, /db\.execute\(sql`/);
  });
}
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd my-app && node --test src/lib/db-usage.test.mts`

Expected: FAIL because `src\app\search-pdb-simple\page.tsx` still imports `Pool` and creates its own connection.

- [ ] **Step 3: Rewrite the simple page to use the shared Drizzle DB**

```ts
import { sql } from "drizzle-orm";

import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

type SimplePdbRow = {
  pdbid: string;
  resolution: number | string | null;
  name: string;
  organism: string;
};

async function fetchRows(): Promise<SimplePdbRow[]> {
  const result = await db.execute(sql`
    select pdb.pdbid, pdb.resolution, protein.name, protein.organism
    from pdb
    inner join pdb2protein on pdb.pdbid = pdb2protein.pdbid
    inner join protein on pdb2protein.proteinid = protein.proteinid
    where pdb.resolution <= 2.5
  `);

  return result.rows as SimplePdbRow[];
}

export default async function SearchPdbSimplePage() {
  const rows = await fetchRows();

  return (
    <main className="page-shell">
      <section className="card">
        <h1>Search Result (Simple)</h1>
        <p>{rows.length} result(s)</p>

        <table className="data-table">
          <thead>
            <tr>
              <th>PDBID</th>
              <th>Resolution</th>
              <th>Protein name</th>
              <th>Organism</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr key={`${row.pdbid}-${row.name}-${index}`}>
                <td>{row.pdbid}</td>
                <td>{row.resolution}</td>
                <td>{row.name}</td>
                <td>{row.organism}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </main>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `cd my-app && node --test src/lib/db-usage.test.mts`

Expected: PASS with 3 passing tests.

- [ ] **Step 5: Commit**

```bash
git add my-app/src/lib/db-usage.test.mts my-app/src/app/search-pdb-simple/page.tsx
git commit -m "refactor: remove route-local pg usage"
```

## Task 5: Run full project verification

**Files:**
- Test: `my-app\src\lib\db.test.mts`
- Test: `my-app\src\lib\pdb.test.mts`
- Test: `my-app\src\lib\proteins.test.mts`
- Test: `my-app\src\lib\db-usage.test.mts`

- [ ] **Step 1: Run the full test suite**

Run: `cd my-app && npm test`

Expected: PASS with all `src/**/*.test.mts` tests green, including the new DB migration tests.

- [ ] **Step 2: Run lint**

Run: `cd my-app && npm run lint`

Expected: PASS with no ESLint errors.

- [ ] **Step 3: Run the production build**

Run in PowerShell:

```powershell
cd E:\Data\App\BioDB2026\my-app
$env:DATABASE_URL = "postgresql://user:password@postgres:5432/demo"
npm run build
```

Expected: PASS with a successful Next.js production build.

- [ ] **Step 4: Inspect the final diff before handoff**

Run: `git --no-pager diff --stat HEAD~4..HEAD`

Expected: shows only the Drizzle migration files from Tasks 1-4 and no unrelated changes.

## Coverage Check

- Shared lazy DB entry point: **Task 1**
- All `pdb` queries moved to `db.execute(sql\`...\`)`: **Task 2**
- All `proteins` queries moved to `db.execute(sql\`...\`)`: **Task 3**
- `search-pdb-simple` no longer creates a local `Pool`: **Task 4**
- Raw `pg` usage blocked from returning outside `src\lib\db.ts`: **Task 4**
- Existing behavior still validated by tests/lint/build: **Task 5**
