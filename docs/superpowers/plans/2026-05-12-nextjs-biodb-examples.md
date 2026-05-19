# Next.js BioDB Examples Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the current `my-app\src` app with a Next.js App Router implementation that matches the PHP examples for search, PDB detail, and protein management without adding API routes.

**Architecture:** Keep the app server-first: GET-based search on `/`, dynamic detail page on `/pdb/[pdbid]`, and Server Actions on `/proteins` for create/fav/delete. Put SQL and validation in small `src\lib` modules so pages stay thin and the behavior can be tested with `node:test` before wiring it into the UI.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, PostgreSQL via `pg`, Node built-in `node:test`, ESLint

---

## File Structure Map

### Create

- `my-app\src\lib\search-filters.ts` — normalize and validate search query input
- `my-app\src\lib\search-filters.test.mts` — tests for query normalization rules
- `my-app\src\lib\pdb.ts` — query functions for PDB search and detail pages
- `my-app\src\lib\pdb.test.mts` — tests for SQL generation and row mapping
- `my-app\src\lib\proteins.ts` — query functions for protein list/create/fav/delete
- `my-app\src\lib\proteins.test.mts` — tests for protein queries and validation handoff
- `my-app\src\lib\protein-form.ts` — validate create form input and mutation messages
- `my-app\src\lib\protein-form.test.mts` — tests for form validation
- `my-app\src\components\site-header.tsx` — shared nav between search and management pages
- `my-app\src\components\confirm-delete-button.tsx` — tiny client component for delete confirmation
- `my-app\src\app\pdb\[pdbid]\page.tsx` — PDB detail page
- `my-app\src\app\proteins\actions.ts` — Server Actions for create/fav/delete
- `my-app\src\app\proteins\protein-create-form.tsx` — client form for action state and validation feedback
- `my-app\src\app\proteins\page.tsx` — protein management page

### Modify

- `my-app\package.json` — add a `test` script based on `node --test`
- `my-app\src\app\layout.tsx` — metadata and shared shell
- `my-app\src\app\globals.css` — app-specific styling for forms, tables, cards, and layout
- `my-app\src\app\page.tsx` — replace placeholder home page with search UI/results
- `my-app\src\lib\db.ts` — keep pool setup but align exports if needed by new query modules
- `my-app\README.md` — document routes and local commands

### Delete

- `my-app\src\app\api\health\route.ts`
- `my-app\src\app\api\proteins\route.ts`
- `my-app\src\app\api\proteins\route-error.ts`
- `my-app\src\app\api\proteins\route-error.test.mts`

## Task 1: Add a test script and search-filter helpers

**Files:**
- Modify: `my-app\package.json`
- Create: `my-app\src\lib\search-filters.ts`
- Test: `my-app\src\lib\search-filters.test.mts`

- [ ] **Step 1: Write the failing search filter tests**

```js
import assert from "node:assert/strict";
import test from "node:test";

import {
  normalizeSearchFilters,
  parseResolutionInput,
} from "./search-filters.ts";

test("normalizeSearchFilters falls back to wildcard-friendly empty strings", () => {
  assert.deepEqual(normalizeSearchFilters({}), {
    id: "",
    name: "",
    className: "",
    organism: "",
    resolution: null,
  });
});

test("normalizeSearchFilters trims text fields and keeps className stable", () => {
  assert.deepEqual(
    normalizeSearchFilters({
      id: " 1abc ",
      name: " kinase ",
      class: " Enzyme ",
      org: " human ",
      res: " 2.5 ",
    }),
    {
      id: "1abc",
      name: "kinase",
      className: "Enzyme",
      organism: "human",
      resolution: 2.5,
    }
  );
});

test("parseResolutionInput rejects invalid numeric values", () => {
  assert.throws(() => parseResolutionInput("-1"), /Resolution must be a positive number/);
  assert.throws(() => parseResolutionInput("abc"), /Resolution must be a positive number/);
});
```

- [ ] **Step 2: Run the search filter tests to verify they fail**

Run: `npm test -- src/lib/search-filters.test.mts`

Expected: FAIL with `Cannot find module './search-filters.ts'` and `Missing script: "test"` on the first run.

- [ ] **Step 3: Add the `test` script and minimal search-filter implementation**

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint",
    "test": "node --test \"src/**/*.test.mts\""
  }
}
```

```ts
export type SearchFilters = {
  id: string;
  name: string;
  className: string;
  organism: string;
  resolution: number | null;
};

type RawFilters = {
  id?: string;
  name?: string;
  class?: string;
  org?: string;
  res?: string;
};

export function parseResolutionInput(value: string | undefined): number | null {
  if (!value || value.trim() === "") {
    return null;
  }

  const parsed = Number(value.trim());
  if (!Number.isFinite(parsed) || parsed <= 0) {
    throw new Error("Resolution must be a positive number");
  }

  return parsed;
}

export function normalizeSearchFilters(raw: RawFilters): SearchFilters {
  return {
    id: raw.id?.trim() ?? "",
    name: raw.name?.trim() ?? "",
    className: raw.class?.trim() ?? "",
    organism: raw.org?.trim() ?? "",
    resolution: parseResolutionInput(raw.res),
  };
}
```

- [ ] **Step 4: Re-run the tests**

Run: `npm test -- src/lib/search-filters.test.mts`

Expected: PASS with 3 passing tests.

- [ ] **Step 5: Commit**

```bash
git add my-app/package.json my-app/src/lib/search-filters.ts my-app/src/lib/search-filters.test.mts
git commit -m "test: add search filter helpers" -m "Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"
```

## Task 2: Add protein-form validation helpers

**Files:**
- Create: `my-app\src\lib\protein-form.ts`
- Test: `my-app\src\lib\protein-form.test.mts`

- [ ] **Step 1: Write the failing protein form tests**

```js
import assert from "node:assert/strict";
import test from "node:test";

import { validateProteinInput } from "./protein-form.ts";

test("validateProteinInput returns trimmed payload for valid input", () => {
  const formData = new FormData();
  formData.set("name", "  Myoglobin ");
  formData.set("org", " Human ");
  formData.set("len", " 154 ");

  assert.deepEqual(validateProteinInput(formData), {
    name: "Myoglobin",
    organism: "Human",
    length: 154,
  });
});

test("validateProteinInput rejects blank values", () => {
  const formData = new FormData();
  formData.set("name", "");
  formData.set("org", "Human");
  formData.set("len", "154");

  assert.throws(() => validateProteinInput(formData), /Protein name is required/);
});

test("validateProteinInput rejects non-positive length", () => {
  const formData = new FormData();
  formData.set("name", "Myoglobin");
  formData.set("org", "Human");
  formData.set("len", "0");

  assert.throws(() => validateProteinInput(formData), /Length must be a positive integer/);
});
```

- [ ] **Step 2: Run the protein form tests to verify they fail**

Run: `npm test -- src/lib/protein-form.test.mts`

Expected: FAIL with `Cannot find module './protein-form.ts'`.

- [ ] **Step 3: Implement validation**

```ts
export type ProteinInput = {
  name: string;
  organism: string;
  length: number;
};

function readRequiredText(formData: FormData, key: string, label: string): string {
  const value = formData.get(key);
  const text = typeof value === "string" ? value.trim() : "";

  if (!text) {
    throw new Error(`${label} is required`);
  }

  return text;
}

export function validateProteinInput(formData: FormData): ProteinInput {
  const name = readRequiredText(formData, "name", "Protein name");
  const organism = readRequiredText(formData, "org", "Organism");
  const lengthValue = readRequiredText(formData, "len", "Length");
  const length = Number(lengthValue);

  if (!Number.isInteger(length) || length <= 0) {
    throw new Error("Length must be a positive integer");
  }

  return { name, organism, length };
}
```

- [ ] **Step 4: Re-run the tests**

Run: `npm test -- src/lib/protein-form.test.mts`

Expected: PASS with 3 passing tests.

- [ ] **Step 5: Commit**

```bash
git add my-app/src/lib/protein-form.ts my-app/src/lib/protein-form.test.mts
git commit -m "test: add protein form validation" -m "Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"
```

## Task 3: Build PDB and protein query modules behind small interfaces

**Files:**
- Create: `my-app\src\lib\pdb.ts`
- Create: `my-app\src\lib\proteins.ts`
- Test: `my-app\src\lib\pdb.test.mts`
- Test: `my-app\src\lib\proteins.test.mts`
- Modify: `my-app\src\lib\db.ts`

- [ ] **Step 1: Write failing tests for search/detail queries**

```js
import assert from "node:assert/strict";
import test from "node:test";

import { buildPdbSearchQuery, buildPdbDetailQuery } from "./pdb.ts";

test("buildPdbSearchQuery adds a resolution predicate only when provided", () => {
  const withResolution = buildPdbSearchQuery({
    id: "1abc",
    name: "",
    className: "Enzyme",
    organism: "",
    resolution: 2.2,
  });

  assert.match(withResolution.text, /pdb\.resolution <= \$5/);
  assert.deepEqual(withResolution.values, ["%1abc%", "%%", "%Enzyme%", "%%", 2.2]);

  const withoutResolution = buildPdbSearchQuery({
    id: "",
    name: "",
    className: "",
    organism: "",
    resolution: null,
  });

  assert.doesNotMatch(withoutResolution.text, /resolution <=/);
  assert.deepEqual(withoutResolution.values, ["%%", "%%", "%%", "%%"]);
});

test("buildPdbDetailQuery filters by pdbid", () => {
  const detail = buildPdbDetailQuery("1GUU");
  assert.match(detail.text, /where \(pdb\.pdbid like \$1\)/i);
  assert.deepEqual(detail.values, ["%1GUU%"]);
});
```

- [ ] **Step 2: Write failing tests for protein list and mutations**

```js
import assert from "node:assert/strict";
import test from "node:test";

import {
  buildCreateProteinQuery,
  buildDeleteProteinQuery,
  buildIncrementFavQuery,
  buildProteinListQuery,
} from "./proteins.ts";

test("buildProteinListQuery selects protein rows in id order", () => {
  assert.match(buildProteinListQuery().text, /select \* from protein/i);
});

test("buildCreateProteinQuery inserts name organism len and default fav", () => {
  const query = buildCreateProteinQuery({
    name: "Myoglobin",
    organism: "Human",
    length: 154,
  });

  assert.match(query.text, /insert into protein\(name, organism, len, fav\)/i);
  assert.deepEqual(query.values, ["Myoglobin", "Human", 154]);
});

test("buildIncrementFavQuery and buildDeleteProteinQuery target proteinid", () => {
  assert.deepEqual(buildIncrementFavQuery(7).values, [7]);
  assert.deepEqual(buildDeleteProteinQuery(7).values, [7]);
});
```

- [ ] **Step 3: Run the query tests to verify they fail**

Run: `npm test -- src/lib/pdb.test.mts src/lib/proteins.test.mts`

Expected: FAIL with missing module errors.

- [ ] **Step 4: Implement the query builders and exported query helpers**

```ts
import { pool } from "@/lib/db";
import type { SearchFilters } from "@/lib/search-filters";

export function buildPdbSearchQuery(filters: SearchFilters) {
  const textParts = [
    "select pdb.pdbid, pdb.method, pdb.resolution, pdb.class, protein.name, protein.organism",
    "from pdb natural join pdb2protein natural join protein",
    "where (pdb.pdbid like $1)",
    "and (protein.name like $2)",
    "and (pdb.class like $3)",
    "and (protein.organism like $4)",
  ];

  const values: Array<string | number> = [
    `%${filters.id}%`,
    `%${filters.name}%`,
    `%${filters.className}%`,
    `%${filters.organism}%`,
  ];

  if (filters.resolution !== null) {
    textParts.push("and (pdb.resolution <= $5)");
    values.push(filters.resolution);
  }

  return { text: textParts.join("\n"), values };
}

export function buildPdbDetailQuery(pdbid: string) {
  return {
    text: `
      select pdb.pdbid, pdb.method, pdb.resolution, pdb.chain, pdb.positions,
             pdb.deposited, pdb.class, pdb.url, protein.name, protein.organism, protein.len
      from pdb natural join pdb2protein natural join protein
      where (pdb.pdbid like $1)
    `,
    values: [`%${pdbid}%`],
  };
}

export async function fetchPdbSearchResults(filters: SearchFilters) {
  const query = buildPdbSearchQuery(filters);
  const result = await pool.query(query);
  return result.rows;
}
```

```ts
import { pool } from "@/lib/db";
import type { ProteinInput } from "@/lib/protein-form";

export function buildProteinListQuery() {
  return { text: "select * from protein order by proteinid", values: [] };
}

export function buildCreateProteinQuery(input: ProteinInput) {
  return {
    text: "insert into protein(name, organism, len, fav) values ($1, $2, $3, 0)",
    values: [input.name, input.organism, input.length],
  };
}

export function buildIncrementFavQuery(proteinId: number) {
  return {
    text: "update protein set fav = fav + 1 where proteinid = $1",
    values: [proteinId],
  };
}

export function buildDeleteProteinQuery(proteinId: number) {
  return {
    text: "delete from protein where proteinid = $1",
    values: [proteinId],
  };
}

export async function fetchProteins() {
  const query = buildProteinListQuery();
  const result = await pool.query(query);
  return result.rows;
}

export async function createProtein(input: ProteinInput) {
  const query = buildCreateProteinQuery(input);
  await pool.query(query);
}

export async function incrementProteinFav(proteinId: number) {
  const query = buildIncrementFavQuery(proteinId);
  await pool.query(query);
}

export async function deleteProtein(proteinId: number) {
  const query = buildDeleteProteinQuery(proteinId);
  await pool.query(query);
}
```

- [ ] **Step 5: Re-run the query tests**

Run: `npm test -- src/lib/pdb.test.mts src/lib/proteins.test.mts`

Expected: PASS with 5 passing tests.

- [ ] **Step 6: Commit**

```bash
git add my-app/src/lib/db.ts my-app/src/lib/pdb.ts my-app/src/lib/pdb.test.mts my-app/src/lib/proteins.ts my-app/src/lib/proteins.test.mts
git commit -m "feat: add biodb query modules" -m "Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"
```

## Task 4: Replace the home page with the PDB search experience

**Files:**
- Modify: `my-app\src\app\layout.tsx`
- Modify: `my-app\src\app\globals.css`
- Modify: `my-app\src\app\page.tsx`
- Create: `my-app\src\components\site-header.tsx`

- [ ] **Step 1: Replace the shared layout metadata and add app navigation**

```tsx
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "BioDB Next.js Demo",
  description: "Search PDB entries and manage proteins with Server Actions.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ja">
      <body>
        {children}
      </body>
    </html>
  );
}
```

```tsx
import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="site-header">
      <nav className="site-nav">
        <Link href="/">PDB Search</Link>
        <Link href="/proteins">Protein Management</Link>
      </nav>
    </header>
  );
}
```

- [ ] **Step 2: Replace the placeholder home page with search UI and server-rendered results**

```tsx
import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { fetchPdbSearchResults } from "@/lib/pdb";
import { normalizeSearchFilters } from "@/lib/search-filters";

type HomeProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function Home({ searchParams }: HomeProps) {
  const raw = await searchParams;
  const filters = normalizeSearchFilters({
    id: typeof raw.id === "string" ? raw.id : "",
    name: typeof raw.name === "string" ? raw.name : "",
    class: typeof raw.class === "string" ? raw.class : "",
    org: typeof raw.org === "string" ? raw.org : "",
    res: typeof raw.res === "string" ? raw.res : "",
  });
  const rows = await fetchPdbSearchResults(filters);

  return (
    <main className="page-shell">
      <SiteHeader />
      <section className="card">
        <h1>Search Protein Database</h1>
        <form className="search-form">
          <input name="id" defaultValue={filters.id} placeholder="PDBID" />
          <input name="name" defaultValue={filters.name} placeholder="Protein Name" />
          <input name="org" defaultValue={filters.organism} placeholder="Organism" />
          <input name="res" defaultValue={filters.resolution ?? ""} placeholder="Resolution" />
          <select name="class" defaultValue={filters.className}>
            <option value="">Any</option>
            <option value="Enzyme">Enzyme</option>
            <option value="DNA-Binding">DNA-binding</option>
            <option value="Membrane">Membrane</option>
          </select>
          <button type="submit">Search</button>
        </form>
      </section>

      <section className="card">
        <p>{rows.length} result(s)</p>
        <table className="data-table">
          <thead>
            <tr>
              <th>PDBID</th>
              <th>Method</th>
              <th>Resolution</th>
              <th>Class</th>
              <th>Protein Name</th>
              <th>Organism</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={`${row.pdbid}-${row.name}`}>
                <td><Link href={`/pdb/${row.pdbid}`}>{row.pdbid}</Link></td>
                <td>{row.method}</td>
                <td>{row.resolution}</td>
                <td>{row.class}</td>
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

- [ ] **Step 3: Add the base styles for cards, forms, and tables**

```css
body {
  margin: 0;
  background: #f5f7fb;
  color: #162033;
  font-family: Arial, Helvetica, sans-serif;
}

.page-shell {
  max-width: 1100px;
  margin: 0 auto;
  padding: 32px 20px 64px;
}

.site-header {
  margin-bottom: 24px;
}

.site-nav {
  display: flex;
  gap: 16px;
}

.card {
  background: #fff;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 8px 30px rgba(15, 23, 42, 0.08);
  margin-bottom: 20px;
}

.search-form {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 12px;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
}
```

- [ ] **Step 4: Run lint and build**

Run: `npm run lint && npm run build`

Expected: PASS. The app should now render the search page with no `/api/*` links.

- [ ] **Step 5: Commit**

```bash
git add my-app/src/app/layout.tsx my-app/src/app/globals.css my-app/src/app/page.tsx my-app/src/components/site-header.tsx
git commit -m "feat: add pdb search page" -m "Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"
```

## Task 5: Add the PDB detail route

**Files:**
- Create: `my-app\src\app\pdb\[pdbid]\page.tsx`
- Modify: `my-app\src\lib\pdb.ts`

- [ ] **Step 1: Add failing tests for detail-format helpers**

```js
import assert from "node:assert/strict";
import test from "node:test";

import { formatResolutionAngstrom, getPdbImagePath } from "./pdb.ts";

test("formatResolutionAngstrom formats the number like the PHP detail page", () => {
  assert.equal(formatResolutionAngstrom(2.3456), "2.35 Å");
});

test("getPdbImagePath points at the public pic directory", () => {
  assert.equal(getPdbImagePath("1GUU"), "/pic/1GUU.jpeg");
});
```

- [ ] **Step 2: Run the updated test to verify it fails**

Run: `npm test -- src/lib/pdb.test.mts`

Expected: FAIL with missing export errors for `formatResolutionAngstrom` and `getPdbImagePath`.

- [ ] **Step 3: Extend `src\lib\pdb.ts` and implement the detail page**

```ts
export async function fetchPdbDetail(pdbid: string) {
  const query = buildPdbDetailQuery(pdbid);
  const result = await pool.query(query);
  return result.rows[0] ?? null;
}

export function formatResolutionAngstrom(value: number | string) {
  return `${Number(value).toFixed(2)} Å`;
}

export function getPdbImagePath(pdbid: string) {
  return `/pic/${pdbid}.jpeg`;
}
```

```tsx
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/site-header";
import {
  fetchPdbDetail,
  formatResolutionAngstrom,
  getPdbImagePath,
} from "@/lib/pdb";

type DetailProps = {
  params: Promise<{ pdbid: string }>;
};

export default async function PdbDetailPage({ params }: DetailProps) {
  const { pdbid } = await params;
  const detail = await fetchPdbDetail(pdbid);

  if (!detail) {
    notFound();
  }

  return (
    <main className="page-shell">
      <SiteHeader />
      <section className="card detail-grid">
        <div>
          <p><Link href="/">Back to search</Link></p>
          <h1>{detail.pdbid}</h1>
          <h2>{detail.name}</h2>
          <p><strong>Organism:</strong> {detail.organism}</p>
          <p><strong>Protein length:</strong> {detail.len} AA</p>
          <ul>
            <li><strong>Chain:</strong> {detail.chain}</li>
            <li><strong>Positions:</strong> {detail.positions}</li>
            <li><strong>Deposited:</strong> {detail.deposited}</li>
            <li><strong>Method:</strong> {detail.method}</li>
            <li><strong>Resolution:</strong> {formatResolutionAngstrom(detail.resolution)}</li>
          </ul>
          <p><a href={detail.url} target="_blank" rel="noreferrer">Open PDB reference</a></p>
        </div>
        <div>
          <Image
            src={getPdbImagePath(detail.pdbid)}
            alt={`${detail.pdbid} structure`}
            width={560}
            height={420}
          />
        </div>
      </section>
    </main>
  );
}
```

- [ ] **Step 4: Re-run tests and build**

Run: `npm test -- src/lib/pdb.test.mts && npm run build`

Expected: PASS. `/pdb/[pdbid]` should compile and use `public/pic`.

- [ ] **Step 5: Commit**

```bash
git add my-app/src/app/pdb/[pdbid]/page.tsx my-app/src/lib/pdb.ts my-app/src/lib/pdb.test.mts
git commit -m "feat: add pdb detail page" -m "Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"
```

## Task 6: Add the protein management page and Server Actions

**Files:**
- Create: `my-app\src\app\proteins\actions.ts`
- Create: `my-app\src\app\proteins\protein-create-form.tsx`
- Create: `my-app\src\app\proteins\page.tsx`
- Create: `my-app\src\components\confirm-delete-button.tsx`
- Modify: `my-app\src\lib\proteins.ts`
- Modify: `my-app\src\app\globals.css`

- [ ] **Step 1: Add tests for mutation state helpers**

```js
import assert from "node:assert/strict";
import test from "node:test";

import { buildCreateProteinQuery, buildDeleteProteinQuery, buildIncrementFavQuery } from "./proteins.ts";

test("mutation query builders return parameterized SQL", () => {
  assert.match(buildCreateProteinQuery({ name: "A", organism: "B", length: 10 }).text, /\$1/);
  assert.match(buildIncrementFavQuery(3).text, /fav = fav \+ 1/i);
  assert.match(buildDeleteProteinQuery(3).text, /delete from protein/i);
});
```

- [ ] **Step 2: Run the tests to verify current coverage before wiring actions**

Run: `npm test -- src/lib/proteins.test.mts src/lib/protein-form.test.mts`

Expected: PASS for helpers before UI wiring starts.

- [ ] **Step 3: Implement the Server Actions**

```ts
"use server";

import { revalidatePath } from "next/cache";
import { validateProteinInput } from "@/lib/protein-form";
import {
  createProtein,
  deleteProtein,
  incrementProteinFav,
} from "@/lib/proteins";

export async function createProteinAction(_: { error: string | null }, formData: FormData) {
  try {
    const input = validateProteinInput(formData);
    await createProtein(input);
    revalidatePath("/proteins");
    return { error: null };
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Failed to create protein" };
  }
}

export async function incrementProteinFavAction(proteinId: number) {
  await incrementProteinFav(proteinId);
  revalidatePath("/proteins");
}

export async function deleteProteinAction(proteinId: number) {
  await deleteProtein(proteinId);
  revalidatePath("/proteins");
}
```

- [ ] **Step 4: Implement the create-form client component, management page, and confirm-delete button**

```tsx
"use client";

export function ConfirmDeleteButton() {
  return (
    <button
      type="submit"
      onClick={(event) => {
        if (!window.confirm("この protein を削除しますか?")) {
          event.preventDefault();
        }
      }}
    >
      Delete
    </button>
  );
}
```

```tsx
import { useActionState } from "react";
import { createProteinAction } from "./actions";

const initialState = { error: null as string | null };

export function ProteinCreateForm() {
  const [state, formAction, isPending] = useActionState(createProteinAction, initialState);

  return (
    <form action={formAction} className="protein-form">
      <input name="name" placeholder="Protein Name" />
      <input name="org" placeholder="Organism" />
      <input name="len" placeholder="Length" inputMode="numeric" />
      <button type="submit" disabled={isPending}>
        {isPending ? "Saving..." : "Insert"}
      </button>
      {state.error ? <p className="form-error">{state.error}</p> : null}
    </form>
  );
}
```

```tsx
import { SiteHeader } from "@/components/site-header";
import { ProteinCreateForm } from "./protein-create-form";
import { ConfirmDeleteButton } from "@/components/confirm-delete-button";
import { deleteProteinAction, incrementProteinFavAction } from "./actions";
import { fetchProteins } from "@/lib/proteins";

export default async function ProteinsPage() {
  const proteins = await fetchProteins();

  return (
    <main className="page-shell">
      <SiteHeader />
      <section className="card">
        <h1>Protein Management</h1>
        <ProteinCreateForm />
      </section>

      <section className="card">
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Organism</th>
              <th>Length</th>
              <th>Like</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {proteins.map((protein) => (
              <tr key={protein.proteinid}>
                <td>{protein.proteinid}</td>
                <td>{protein.name}</td>
                <td>{protein.organism}</td>
                <td>{protein.len}</td>
                <td>
                  <form action={incrementProteinFavAction.bind(null, protein.proteinid)}>
                    <button type="submit">{protein.fav}</button>
                  </form>
                </td>
                <td>
                  <form action={deleteProteinAction.bind(null, protein.proteinid)}>
                    <ConfirmDeleteButton />
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </main>
  );
}
```

- [ ] **Step 5: Run tests, lint, and build**

Run: `npm test -- src/lib/protein-form.test.mts src/lib/proteins.test.mts && npm run lint && npm run build`

Expected: PASS. `/proteins` should now support create/fav/delete through Server Actions.

- [ ] **Step 6: Commit**

```bash
git add my-app/src/app/proteins/actions.ts my-app/src/app/proteins/protein-create-form.tsx my-app/src/app/proteins/page.tsx my-app/src/components/confirm-delete-button.tsx my-app/src/lib/proteins.ts my-app/src/app/globals.css
git commit -m "feat: add protein management server actions" -m "Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"
```

## Task 7: Remove obsolete API routes, refresh docs, and run final verification

**Files:**
- Delete: `my-app\src\app\api\health\route.ts`
- Delete: `my-app\src\app\api\proteins\route.ts`
- Delete: `my-app\src\app\api\proteins\route-error.ts`
- Delete: `my-app\src\app\api\proteins\route-error.test.mts`
- Modify: `my-app\README.md`

- [ ] **Step 1: Delete the API-route files now replaced by pages and actions**

```bash
git rm my-app/src/app/api/health/route.ts
git rm my-app/src/app/api/proteins/route.ts
git rm my-app/src/app/api/proteins/route-error.ts
git rm my-app/src/app/api/proteins/route-error.test.mts
```

- [ ] **Step 2: Update the README for the new route map**

````md
## Routes

- `/` — PDB search form and results
- `/pdb/[pdbid]` — PDB detail page backed by PostgreSQL and `public/pic`
- `/proteins` — Protein list plus create/fav/delete actions

## Commands

```bash
npm install
npm test
npm run lint
npm run build
npm run dev
```
````

- [ ] **Step 3: Run the full verification set**

Run: `npm test && npm run lint && npm run build`

Expected: PASS. The app should have no remaining `src/app/api` dependencies and should compile around page routes only.

- [ ] **Step 4: Commit**

```bash
git add my-app/README.md
git commit -m "refactor: remove api routes for biodb pages" -m "Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"
```

## Self-Review Checklist

- Spec coverage:
  - Search page: Task 4
  - PDB detail page: Task 5
  - Protein list/create/fav/delete: Task 6
  - API-route removal: Task 7
  - Shared navigation and modernized UI: Tasks 4 and 6
  - `public/pic` usage: Task 5
- Placeholder scan: No `TODO`, `TBD`, or cross-task “same as above” shortcuts remain
- Type consistency:
  - `SearchFilters` uses `className` consistently
  - protein actions use `ProteinInput.length`
  - route names stay `/`, `/pdb/[pdbid]`, `/proteins`
