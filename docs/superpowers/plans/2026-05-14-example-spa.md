# Example SPA Search Experience Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build `src\app\example-spa` as a React-forward SPA-style PDB search page with debounced local-state search and popover detail loading, while reusing and extending the shared `src\lib` database/query helpers.

**Architecture:** Extend the shared search model first so the new route does not fork query logic from the existing examples. Then add a small shadcn-style UI primitive layer, thin Server Actions for search/detail fetching, and a focused client shell that manages filters, search results, selected PDB state, and popover detail loading entirely in React state.

**Tech Stack:** Next.js App Router, React 19, Server Actions, TypeScript, node:test, PostgreSQL via `pg`, Tailwind CSS, Radix Popover, clsx, tailwind-merge

---

## File Structure

- **Modify:** `my-app\src\lib\search-filters.ts`
  - Extend the shared search contract to include `method`.
- **Create:** `my-app\src\lib\search-filters.test.mts`
  - Unit tests for method-aware filter normalization.
- **Modify:** `my-app\src\lib\pdb.ts`
  - Add method filtering to the shared PDB search query builder.
- **Modify:** `my-app\src\lib\pdb.test.mts`
  - Lock the new SQL/value ordering with tests.
- **Modify:** `my-app\package.json`
  - Add the minimum UI helper dependencies for shadcn-style components.
- **Create:** `my-app\src\lib\utils.ts`
  - `cn()` helper for Tailwind class composition.
- **Create:** `my-app\src\lib\utils.test.mts`
  - Unit tests for `cn()`.
- **Create:** `my-app\src\components\ui\card.tsx`
- **Create:** `my-app\src\components\ui\input.tsx`
- **Create:** `my-app\src\components\ui\table.tsx`
- **Create:** `my-app\src\components\ui\popover.tsx`
- **Create:** `my-app\src\components\ui\alert.tsx`
- **Create:** `my-app\src\components\ui\skeleton.tsx`
  - Minimal reusable UI building blocks for the new route.
- **Create:** `my-app\src\app\example-spa\types.ts`
  - Shared types for the new route.
- **Create:** `my-app\src\app\example-spa\client-state.ts`
  - Pure state helpers for search/detail transitions.
- **Create:** `my-app\src\app\example-spa\client-state.test.mts`
  - Unit tests for the route-local state transitions.
- **Create:** `my-app\src\app\example-spa\actions.ts`
  - Thin Server Actions for search and detail fetches.
- **Create:** `my-app\src\app\example-spa\search-form.tsx`
  - Controlled filter form.
- **Create:** `my-app\src\app\example-spa\search-results-table.tsx`
  - Start with a placeholder table shell, then upgrade it to the popover-enabled result table.
- **Create:** `my-app\src\app\example-spa\pdb-detail-popover.tsx`
  - Detail popover content and states.
- **Create:** `my-app\src\app\example-spa\example-spa-client-shell.tsx`
  - Debounced SPA orchestration.
- **Create:** `my-app\src\app\example-spa\page.tsx`
  - Route entry point.
- **Modify:** `my-app\src\app\page.tsx`
  - Add a navigation link to the new route so it is easy to reach during verification.

### Task 1: Extend the shared search filter model

**Files:**
- Create: `my-app\src\lib\search-filters.test.mts`
- Modify: `my-app\src\lib\search-filters.ts`
- Test: `my-app\src\lib\search-filters.test.mts`

- [ ] **Step 1: Write the failing test**

```ts
import assert from "node:assert/strict";
import test from "node:test";

import { normalizeSearchFilters } from "./search-filters.ts";

test("normalizeSearchFilters trims text filters including method", () => {
  assert.deepEqual(
    normalizeSearchFilters({
      id: " 1abc ",
      method: " X-RAY DIFFRACTION ",
      name: " Hemoglobin ",
      class: " Enzyme ",
      org: " Human ",
      res: " 2.4 ",
    }),
    {
      id: "1abc",
      method: "X-RAY DIFFRACTION",
      name: "Hemoglobin",
      className: "Enzyme",
      organism: "Human",
      resolution: 2.4,
    },
  );
});

test("normalizeSearchFilters keeps blank method empty", () => {
  assert.equal(
    normalizeSearchFilters({ id: "", method: "   ", name: "", class: "", org: "", res: "" }).method,
    "",
  );
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd my-app && node --test src/lib/search-filters.test.mts`

Expected: FAIL because `SearchFilters`/`normalizeSearchFilters` do not yet expose `method`.

- [ ] **Step 3: Write minimal implementation**

```ts
export type SearchFilters = {
  id: string;
  method: string;
  name: string;
  className: string;
  organism: string;
  resolution: number | null;
};

type RawFilters = {
  id?: string;
  method?: string;
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
    method: raw.method?.trim() ?? "",
    name: raw.name?.trim() ?? "",
    className: raw.class?.trim() ?? "",
    organism: raw.org?.trim() ?? "",
    resolution: parseResolutionInput(raw.res),
  };
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `cd my-app && node --test src/lib/search-filters.test.mts`

Expected: PASS with 2 passing tests.

- [ ] **Step 5: Commit**

```bash
git add my-app/src/lib/search-filters.ts my-app/src/lib/search-filters.test.mts
git commit -m "test: cover method-aware search filters"
```

### Task 2: Extend the shared PDB search query

**Files:**
- Modify: `my-app\src\lib\pdb.ts`
- Modify: `my-app\src\lib\pdb.test.mts`
- Test: `my-app\src\lib\pdb.test.mts`

- [ ] **Step 1: Write the failing test**

```ts
test("buildPdbSearchQuery filters by method before applying resolution", () => {
  const query = buildPdbSearchQuery({
    id: "1abc",
    method: "X-RAY",
    name: "",
    className: "Enzyme",
    organism: "",
    resolution: 2.2,
  });

  assert.match(query.text, /pdb\.method like \$2/);
  assert.match(query.text, /pdb\.resolution <= \$6/);
  assert.deepEqual(query.values, ["%1abc%", "%X-RAY%", "%%", "%Enzyme%", "%%", 2.2]);
});

test("buildPdbSearchQuery keeps method in the values list when resolution is empty", () => {
  const query = buildPdbSearchQuery({
    id: "",
    method: "NMR",
    name: "",
    className: "",
    organism: "",
    resolution: null,
  });

  assert.doesNotMatch(query.text, /resolution <=/);
  assert.deepEqual(query.values, ["%%", "%NMR%", "%%", "%%", "%%"]);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd my-app && node --test src/lib/pdb.test.mts`

Expected: FAIL because the query builder does not yet include `pdb.method`.

- [ ] **Step 3: Write minimal implementation**

```ts
export function buildPdbSearchQuery(filters: SearchFilters) {
  const textParts = [
    "select pdb.pdbid, pdb.method, pdb.resolution, pdb.class, protein.name, protein.organism",
    "from pdb natural join pdb2protein natural join protein",
    "where (pdb.pdbid like $1)",
    "and (pdb.method like $2)",
    "and (protein.name like $3)",
    "and (pdb.class like $4)",
    "and (protein.organism like $5)",
  ];

  const values: Array<string | number> = [
    `%${filters.id}%`,
    `%${filters.method}%`,
    `%${filters.name}%`,
    `%${filters.className}%`,
    `%${filters.organism}%`,
  ];

  if (filters.resolution !== null) {
    textParts.push("and (pdb.resolution <= $6)");
    values.push(filters.resolution);
  }

  return { text: textParts.join("\n"), values };
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `cd my-app && node --test src/lib/pdb.test.mts`

Expected: PASS with all PDB query tests green.

- [ ] **Step 5: Commit**

```bash
git add my-app/src/lib/pdb.ts my-app/src/lib/pdb.test.mts
git commit -m "feat: add method filtering to shared pdb search"
```

### Task 3: Add the minimal shadcn-style UI foundation

**Files:**
- Modify: `my-app\package.json`
- Create: `my-app\src\lib\utils.ts`
- Create: `my-app\src\lib\utils.test.mts`
- Create: `my-app\src\components\ui\card.tsx`
- Create: `my-app\src\components\ui\input.tsx`
- Create: `my-app\src\components\ui\table.tsx`
- Create: `my-app\src\components\ui\popover.tsx`
- Create: `my-app\src\components\ui\alert.tsx`
- Create: `my-app\src\components\ui\skeleton.tsx`
- Test: `my-app\src\lib\utils.test.mts`

- [ ] **Step 1: Write the failing test**

```ts
import assert from "node:assert/strict";
import test from "node:test";

import { cn } from "./utils.ts";

test("cn merges class names and ignores falsy values", () => {
  assert.equal(cn("rounded", undefined, "border", false && "hidden", "rounded"), "border rounded");
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd my-app && node --test src/lib/utils.test.mts`

Expected: FAIL because `src/lib/utils.ts` does not exist yet.

- [ ] **Step 3: Install dependencies and write the UI foundation**

```json
{
  "dependencies": {
    "@radix-ui/react-popover": "^1.1.13",
    "clsx": "^2.1.1",
    "next": "16.2.6",
    "pg": "^8.20.0",
    "react": "19.2.4",
    "react-dom": "19.2.4",
    "tailwind-merge": "^3.3.1"
  }
}
```

```ts
// src/lib/utils.ts
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: Parameters<typeof clsx>) {
  return twMerge(clsx(...inputs));
}
```

```tsx
// src/components/ui/card.tsx
import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("rounded-2xl border bg-white shadow-sm", className)} {...props} />;
}

export function CardHeader({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("space-y-1.5 p-6", className)} {...props} />;
}

export function CardTitle({ className, ...props }: HTMLAttributes<HTMLHeadingElement>) {
  return <h2 className={cn("text-xl font-semibold tracking-tight", className)} {...props} />;
}

export function CardContent({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("p-6 pt-0", className)} {...props} />;
}
```

```tsx
// src/components/ui/input.tsx
import type { InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm shadow-xs outline-none transition focus-visible:border-slate-950 focus-visible:ring-2 focus-visible:ring-slate-200",
        className,
      )}
      {...props}
    />
  );
}
```

```tsx
// src/components/ui/table.tsx
import type { HTMLAttributes, TableHTMLAttributes, ThHTMLAttributes, TdHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Table({ className, ...props }: TableHTMLAttributes<HTMLTableElement>) {
  return <table className={cn("w-full caption-bottom text-sm", className)} {...props} />;
}

export function TableHeader({ className, ...props }: HTMLAttributes<HTMLTableSectionElement>) {
  return <thead className={cn("[&_tr]:border-b", className)} {...props} />;
}

export function TableBody({ className, ...props }: HTMLAttributes<HTMLTableSectionElement>) {
  return <tbody className={cn("[&_tr:last-child]:border-0", className)} {...props} />;
}

export function TableRow({ className, ...props }: HTMLAttributes<HTMLTableRowElement>) {
  return <tr className={cn("border-b transition-colors hover:bg-slate-50", className)} {...props} />;
}

export function TableHead({ className, ...props }: ThHTMLAttributes<HTMLTableCellElement>) {
  return <th className={cn("h-12 px-4 text-left align-middle font-medium text-slate-500", className)} {...props} />;
}

export function TableCell({ className, ...props }: TdHTMLAttributes<HTMLTableCellElement>) {
  return <td className={cn("p-4 align-middle", className)} {...props} />;
}
```

```tsx
// src/components/ui/popover.tsx
"use client";

import * as PopoverPrimitive from "@radix-ui/react-popover";
import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/utils";

export const Popover = PopoverPrimitive.Root;
export const PopoverTrigger = PopoverPrimitive.Trigger;

export function PopoverContent({
  className,
  align = "start",
  sideOffset = 8,
  ...props
}: ComponentPropsWithoutRef<typeof PopoverPrimitive.Content>) {
  return (
    <PopoverPrimitive.Portal>
      <PopoverPrimitive.Content
        align={align}
        sideOffset={sideOffset}
        className={cn("z-50 w-96 rounded-xl border bg-white p-4 shadow-lg outline-none", className)}
        {...props}
      />
    </PopoverPrimitive.Portal>
  );
}
```

```tsx
// src/components/ui/alert.tsx
import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Alert({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700", className)} {...props} />;
}
```

```tsx
// src/components/ui/skeleton.tsx
import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Skeleton({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("animate-pulse rounded-md bg-slate-200", className)} {...props} />;
}
```

- [ ] **Step 4: Run dependency install and verify the test passes**

Run:
- `cd my-app && npm install`
- `cd my-app && node --test src/lib/utils.test.mts`

Expected:
- `npm install` completes without peer dependency errors.
- `node --test` shows 1 passing test.

- [ ] **Step 5: Commit**

```bash
git add my-app/package.json my-app/package-lock.json my-app/src/lib/utils.ts my-app/src/lib/utils.test.mts my-app/src/components/ui
git commit -m "feat: add ui primitives for example spa"
```

### Task 4: Add route-local state helpers and Server Actions

**Files:**
- Create: `my-app\src\app\example-spa\types.ts`
- Create: `my-app\src\app\example-spa\client-state.ts`
- Create: `my-app\src\app\example-spa\client-state.test.mts`
- Create: `my-app\src\app\example-spa\actions.ts`
- Test: `my-app\src\app\example-spa\client-state.test.mts`

- [ ] **Step 1: Write the failing test**

```ts
import assert from "node:assert/strict";
import test from "node:test";

import {
  createInitialSpaState,
  finishSearchSuccess,
  startDetailLoad,
  startSearch,
} from "./client-state.ts";

test("startSearch stores the next filters and clears stale search errors", () => {
  const state = startSearch(
    createInitialSpaState(),
    { id: "1abc", method: "X-RAY", name: "", class: "", org: "", res: "" },
  );

  assert.equal(state.filters.id, "1abc");
  assert.equal(state.isSearching, true);
  assert.equal(state.searchError, null);
});

test("finishSearchSuccess resets selected detail state when rows change", () => {
  const started = startDetailLoad(createInitialSpaState(), "1ABC");
  const finished = finishSearchSuccess(started, [
    { pdbid: "2XYZ", method: "NMR", resolution: 1.8, class: "Enzyme", name: "Demo", organism: "Human" },
  ]);

  assert.equal(finished.selectedPdbId, null);
  assert.equal(finished.selectedDetail, null);
  assert.equal(finished.isSearching, false);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd my-app && node --test src/app/example-spa/client-state.test.mts`

Expected: FAIL because the route-local state module does not exist yet.

- [ ] **Step 3: Write minimal implementation**

```ts
// src/app/example-spa/types.ts
export type SpaSearchForm = {
  id: string;
  method: string;
  name: string;
  class: string;
  org: string;
  res: string;
};

export type SpaSearchRow = {
  pdbid: string;
  method: string;
  resolution: number | string | null;
  class: string;
  name: string;
  organism: string;
};

export type SpaPdbDetail = {
  pdbid: string;
  method: string;
  resolution: number | string | null;
  chain: string;
  positions: string;
  deposited: string;
  class: string;
  url: string;
  name: string;
  organism: string;
  len: number;
} | null;

export type ExampleSpaState = {
  filters: SpaSearchForm;
  results: SpaSearchRow[];
  selectedPdbId: string | null;
  selectedDetail: SpaPdbDetail;
  isSearching: boolean;
  isDetailLoading: boolean;
  searchError: string | null;
  detailError: string | null;
};
```

```ts
// src/app/example-spa/client-state.ts
import type { ExampleSpaState, SpaPdbDetail, SpaSearchForm, SpaSearchRow } from "./types";

export const EMPTY_FILTERS: SpaSearchForm = {
  id: "",
  method: "",
  name: "",
  class: "",
  org: "",
  res: "",
};

export function createInitialSpaState(): ExampleSpaState {
  return {
    filters: EMPTY_FILTERS,
    results: [],
    selectedPdbId: null,
    selectedDetail: null,
    isSearching: false,
    isDetailLoading: false,
    searchError: null,
    detailError: null,
  };
}

export function startSearch(state: ExampleSpaState, filters: SpaSearchForm): ExampleSpaState {
  return { ...state, filters, isSearching: true, searchError: null };
}

export function finishSearchSuccess(state: ExampleSpaState, results: SpaSearchRow[]): ExampleSpaState {
  return {
    ...state,
    results,
    isSearching: false,
    searchError: null,
    selectedPdbId: null,
    selectedDetail: null,
    isDetailLoading: false,
    detailError: null,
  };
}

export function finishSearchError(state: ExampleSpaState, message: string): ExampleSpaState {
  return { ...state, isSearching: false, searchError: message };
}

export function startDetailLoad(state: ExampleSpaState, pdbid: string): ExampleSpaState {
  return { ...state, selectedPdbId: pdbid, selectedDetail: null, isDetailLoading: true, detailError: null };
}

export function finishDetailSuccess(state: ExampleSpaState, detail: SpaPdbDetail): ExampleSpaState {
  return { ...state, selectedDetail: detail, isDetailLoading: false, detailError: null };
}

export function finishDetailError(state: ExampleSpaState, message: string): ExampleSpaState {
  return { ...state, isDetailLoading: false, detailError: message };
}
```

```ts
// src/app/example-spa/actions.ts
"use server";

import { fetchPdbDetail, fetchPdbSearchResults } from "@/lib/pdb";
import { normalizeSearchFilters } from "@/lib/search-filters";
import type { SpaSearchForm } from "./types";

export async function searchPdbAction(raw: SpaSearchForm) {
  try {
    const filters = normalizeSearchFilters(raw);
    const rows = await fetchPdbSearchResults(filters);
    return { ok: true as const, rows };
  } catch (error) {
    return { ok: false as const, message: error instanceof Error ? error.message : "Failed to search PDB" };
  }
}

export async function getPdbDetailAction(pdbid: string) {
  try {
    const detail = await fetchPdbDetail(pdbid);
    if (!detail) {
      return { ok: false as const, message: `No detail found for ${pdbid}` };
    }

    return { ok: true as const, detail };
  } catch (error) {
    return { ok: false as const, message: error instanceof Error ? error.message : "Failed to load detail" };
  }
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `cd my-app && node --test src/app/example-spa/client-state.test.mts`

Expected: PASS with the state transition tests green.

- [ ] **Step 5: Commit**

```bash
git add my-app/src/app/example-spa/types.ts my-app/src/app/example-spa/client-state.ts my-app/src/app/example-spa/client-state.test.mts my-app/src/app/example-spa/actions.ts
git commit -m "feat: add example spa data flow helpers"
```

### Task 5: Build the SPA shell and debounced search UI

**Files:**
- Create: `my-app\src\app\example-spa\page.tsx`
- Create: `my-app\src\app\example-spa\example-spa-client-shell.tsx`
- Create: `my-app\src\app\example-spa\search-form.tsx`
- Create: `my-app\src\app\example-spa\search-results-table.tsx`
- Test: `my-app\src\app\example-spa\client-state.test.mts`

- [ ] **Step 1: Write the route first so the build fails on missing client code**

```tsx
import { ExampleSpaClientShell } from "./example-spa-client-shell";

export default function ExampleSpaPage() {
  return <ExampleSpaClientShell />;
}
```

- [ ] **Step 2: Run build to verify it fails**

Run: `cd my-app && npm run build`

Expected: FAIL with a module-not-found error for `./example-spa-client-shell`.

- [ ] **Step 3: Write the minimal implementation**

```tsx
// src/app/example-spa/search-form.tsx
"use client";

import type { ChangeEvent } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import type { SpaSearchForm } from "./types";

type SearchFormProps = {
  value: SpaSearchForm;
  onChange: (next: SpaSearchForm) => void;
  isSearching: boolean;
};

export function SearchForm({ value, onChange, isSearching }: SearchFormProps) {
  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const { name, value: nextValue } = event.target;
    onChange({ ...value, [name]: nextValue });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>SPA PDB Search</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <Input name="id" value={value.id} onChange={handleChange} placeholder="PDB ID" />
        <Input name="method" value={value.method} onChange={handleChange} placeholder="Method" />
        <Input name="name" value={value.name} onChange={handleChange} placeholder="Protein name" />
        <Input name="class" value={value.class} onChange={handleChange} placeholder="Class" />
        <Input name="org" value={value.org} onChange={handleChange} placeholder="Organism" />
        <Input name="res" value={value.res} onChange={handleChange} placeholder="Resolution <= " />
        <p className="text-sm text-slate-500 md:col-span-2 xl:col-span-3">
          {isSearching ? "Searching..." : "Results update automatically after a short debounce."}
        </p>
      </CardContent>
    </Card>
  );
}
```

```tsx
// src/app/example-spa/search-results-table.tsx
"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { ExampleSpaState } from "./types";

type SearchResultsTableProps = {
  state: ExampleSpaState;
  setState: React.Dispatch<React.SetStateAction<ExampleSpaState>>;
};

export function SearchResultsTable({ state }: SearchResultsTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>PDB ID</TableHead>
          <TableHead>Method</TableHead>
          <TableHead>Resolution</TableHead>
          <TableHead>Class</TableHead>
          <TableHead>Protein Name</TableHead>
          <TableHead>Organism</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {state.results.map((row) => (
          <TableRow key={`${row.pdbid}-${row.name}`}>
            <TableCell>{row.pdbid}</TableCell>
            <TableCell>{row.method}</TableCell>
            <TableCell>{row.resolution}</TableCell>
            <TableCell>{row.class}</TableCell>
            <TableCell>{row.name}</TableCell>
            <TableCell>{row.organism}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
```

```tsx
// src/app/example-spa/example-spa-client-shell.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { searchPdbAction } from "./actions";
import {
  createInitialSpaState,
  finishSearchError,
  finishSearchSuccess,
  startSearch,
} from "./client-state";
import { SearchForm } from "./search-form";
import { SearchResultsTable } from "./search-results-table";
import { Alert } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { SpaSearchForm } from "./types";

export function ExampleSpaClientShell() {
  const [state, setState] = useState(createInitialSpaState);

  const debouncedFilters = useMemo(() => state.filters, [state.filters]);

  useEffect(() => {
    const timer = window.setTimeout(async () => {
      setState((current) => startSearch(current, debouncedFilters));
      const result = await searchPdbAction(debouncedFilters);
      setState((current) => (result.ok ? finishSearchSuccess(current, result.rows) : finishSearchError(current, result.message)));
    }, 350);

    return () => window.clearTimeout(timer);
  }, [debouncedFilters]);

  function handleFiltersChange(next: SpaSearchForm) {
    setState((current) => ({ ...current, filters: next }));
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-7xl flex-col gap-6 px-4 py-8">
      <SearchForm value={state.filters} onChange={handleFiltersChange} isSearching={state.isSearching} />
      <Card>
        <CardHeader>
          <CardTitle>Search Results</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {state.searchError ? <Alert>{state.searchError}</Alert> : null}
          <SearchResultsTable state={state} setState={setState} />
        </CardContent>
      </Card>
    </main>
  );
}
```

- [ ] **Step 4: Run targeted tests and lint**

Run:
- `cd my-app && node --test src/app/example-spa/client-state.test.mts`
- `cd my-app && npm run lint -- src/app/example-spa/search-form.tsx src/app/example-spa/search-results-table.tsx src/app/example-spa/example-spa-client-shell.tsx`

Expected:
- State helper tests still pass.
- ESLint reports no errors in the new shell/form files.

- [ ] **Step 5: Commit**

```bash
git add my-app/src/app/example-spa/page.tsx my-app/src/app/example-spa/example-spa-client-shell.tsx my-app/src/app/example-spa/search-form.tsx my-app/src/app/example-spa/search-results-table.tsx
git commit -m "feat: add example spa search shell"
```

### Task 6: Add the results table and on-demand popover detail experience

**Files:**
- Modify: `my-app\src\app\example-spa\search-results-table.tsx`
- Create: `my-app\src\app\example-spa\pdb-detail-popover.tsx`
- Modify: `my-app\src\app\example-spa\example-spa-client-shell.tsx`
- Modify: `my-app\src\app\page.tsx`
- [ ] **Step 1: Wire the popover import into the table first so the build fails**

```tsx
import { PdbDetailPopover } from "./pdb-detail-popover";
```

- [ ] **Step 2: Run build to verify it fails**

Run: `cd my-app && npm run build`

Expected: FAIL with a module-not-found error for `./pdb-detail-popover`.

- [ ] **Step 3: Write the minimal implementation**

```tsx
// src/app/example-spa/pdb-detail-popover.tsx
"use client";

import Image from "next/image";
import { Alert } from "@/components/ui/alert";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Skeleton } from "@/components/ui/skeleton";
import type { ExampleSpaState } from "./types";

type PdbDetailPopoverProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  pdbid: string;
  state: ExampleSpaState;
  children: React.ReactNode;
};

export function PdbDetailPopover({ open, onOpenChange, pdbid, state, children }: PdbDetailPopoverProps) {
  const detail = state.selectedPdbId === pdbid ? state.selectedDetail : null;
  const isLoading = state.selectedPdbId === pdbid && state.isDetailLoading;
  const detailError = state.selectedPdbId === pdbid ? state.detailError : null;

  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent className="w-[32rem]">
        {isLoading ? (
          <div className="space-y-3">
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        ) : detailError ? (
          <Alert>{detailError}</Alert>
        ) : detail ? (
          <div className="grid gap-4 md:grid-cols-[200px_minmax(0,1fr)]">
            <Image
              src={`/pic/${detail.pdbid.toLowerCase()}.jpeg`}
              alt={`${detail.pdbid} structure`}
              width={200}
              height={200}
              className="rounded-lg object-cover"
            />
            <div className="space-y-1 text-sm">
              <h3 className="text-lg font-semibold">{detail.pdbid}</h3>
              <p>{detail.name}</p>
              <p>Method: {detail.method}</p>
              <p>Resolution: {detail.resolution}</p>
              <p>Chain: {detail.chain}</p>
              <p>Positions: {detail.positions}</p>
              <p>Deposited: {detail.deposited}</p>
              <p>Class: {detail.class}</p>
              <p>Organism: {detail.organism}</p>
              <p>Length: {detail.len}</p>
              <a className="font-medium text-slate-900 underline" href={detail.url} target="_blank" rel="noreferrer">
                View on PDB
              </a>
            </div>
          </div>
        ) : (
          <p className="text-sm text-slate-500">Select a structure to load its details.</p>
        )}
      </PopoverContent>
    </Popover>
  );
}
```

```tsx
// src/app/example-spa/search-results-table.tsx
"use client";

import { useState } from "react";
import { getPdbDetailAction } from "./actions";
import { finishDetailError, finishDetailSuccess, startDetailLoad } from "./client-state";
import { PdbDetailPopover } from "./pdb-detail-popover";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { ExampleSpaState } from "./types";

type SearchResultsTableProps = {
  state: ExampleSpaState;
  setState: React.Dispatch<React.SetStateAction<ExampleSpaState>>;
};

export function SearchResultsTable({ state, setState }: SearchResultsTableProps) {
  const [openPdbId, setOpenPdbId] = useState<string | null>(null);

  async function handleOpenChange(pdbid: string, open: boolean) {
    setOpenPdbId(open ? pdbid : null);
    if (!open) {
      return;
    }

    setState((current) => startDetailLoad(current, pdbid));
    const result = await getPdbDetailAction(pdbid);
    setState((current) => (result.ok ? finishDetailSuccess(current, result.detail) : finishDetailError(current, result.message)));
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>PDB ID</TableHead>
          <TableHead>Method</TableHead>
          <TableHead>Resolution</TableHead>
          <TableHead>Class</TableHead>
          <TableHead>Protein Name</TableHead>
          <TableHead>Organism</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {state.results.map((row) => (
          <TableRow key={`${row.pdbid}-${row.name}`}>
            <TableCell>
              <PdbDetailPopover
                pdbid={row.pdbid}
                open={openPdbId === row.pdbid}
                onOpenChange={(open) => void handleOpenChange(row.pdbid, open)}
                state={state}
              >
                <button type="button" className="font-semibold text-slate-900 underline">
                  {row.pdbid}
                </button>
              </PdbDetailPopover>
            </TableCell>
            <TableCell>{row.method}</TableCell>
            <TableCell>{row.resolution}</TableCell>
            <TableCell>{row.class}</TableCell>
            <TableCell>{row.name}</TableCell>
            <TableCell>{row.organism}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
```

```tsx
// src/app/page.tsx
<div className="page-links">
  <Link href="/example-spa">Go to Example SPA Page</Link>
</div>
```

- [ ] **Step 4: Run the focused test suite plus full verification**

Run:
- `cd my-app && node --test src/app/example-spa/client-state.test.mts`
- `cd my-app && npm test`
- `cd my-app && npm run lint`
- `cd my-app && set DATABASE_URL=postgresql://user:password@postgres:5432/demo && npm run build`

Expected:
- State helper tests pass.
- Full `npm test` passes.
- Lint succeeds.
- Build succeeds with `DATABASE_URL` set.

- [ ] **Step 5: Commit**

```bash
git add my-app/src/app/example-spa my-app/src/app/page.tsx
git commit -m "feat: add example spa search experience"
```

## Self-Review Checklist

- Spec coverage:
  - Shared method filter support is covered by Tasks 1 and 2.
  - shadcn/Tailwind foundation is covered by Task 3.
  - Thin Server Actions and local React state are covered by Task 4.
  - Debounced SPA search UI is covered by Task 5.
  - Popover detail loading and route discoverability are covered by Task 6.
- Placeholder scan:
  - No `TODO`, `TBD`, or "similar to Task N" references remain.
  - Each task includes concrete files, commands, and code.
- Type consistency:
  - The route uses `SpaSearchForm`, `ExampleSpaState`, and `SpaPdbDetail` consistently across tests, actions, and UI files.
