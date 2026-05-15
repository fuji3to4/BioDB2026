# Drizzle-Based Database Access Migration Design

## Problem

`E:\Data\App\BioDB2026\my-app\src` currently mixes direct `pg` usage in multiple places:

- `src\lib\db.ts` exposes a `Pool`
- `src\lib\pdb.ts` and `src\lib\proteins.ts` call `pool.query(...)`
- `src\app\search-pdb-simple\page.tsx` creates its own `Pool`

The goal is to make database access Drizzle-based across `src`, while keeping the SQL itself easy to read for beginners. In particular, raw SQL should remain visible through patterns like:

```ts
const result = await db.execute(sql`
  select ...
  from ...
  where pdb.pdbid like '%' || ${filters.id} || '%'
`);
```

This is a runtime migration only. It does not include migration management, schema generation, or broader database tooling.

## Goals

- Replace direct `pg` access in `my-app\src` with a shared Drizzle-based entry point.
- Keep SQL written explicitly with `db.execute(sql\`...\`)` rather than hiding it behind builders.
- Make the data-access flow simpler for beginners by removing unnecessary intermediate query objects.
- Allow call sites to be cleaned up to match the new Drizzle-based shape where that improves clarity.
- Preserve current application behavior for PDB search, PDB detail, protein listing, protein creation, fav increment, and protein deletion.

## Non-Goals

- Adding `drizzle-kit`, migrations, or schema introspection workflows.
- Converting queries to the Drizzle query builder API.
- Introducing reusable abstraction layers that hide SQL execution details.
- Refactoring unrelated UI behavior or route structure.

## Recommended Approach

Use Drizzle only as the shared database access layer, and express every query as raw SQL through `db.execute(sql\`...\`)`.

This keeps the migration conceptually small:

1. One shared `db`
2. One SQL style
3. No extra builder helpers
4. No schema file unless it becomes necessary later

That approach best matches the teaching goal. Students can still see the SQL directly, but the project no longer teaches multiple connection patterns at once.

## Architecture

### Shared database entry point

`src\lib\db.ts` becomes the single database entry point for all PostgreSQL access in `src`.

It should:

- lazily read `DATABASE_URL`
- lazily create a `pg` `Pool`
- wrap the pool with `drizzle(...)`
- export the Drizzle `db`

The current reuse pattern for development can remain, but only `db` should be exported for normal usage. `Pool` should no longer be imported elsewhere under `src`.

### No schema file for this migration

Do not add `src\lib\schema.ts` in this iteration.

Because the chosen direction is raw SQL everywhere, a schema file would add explanation overhead without helping the main learning objective. If the project later adopts query builder usage or migrations, a schema can be introduced then.

## Component and Module Changes

### `src\lib\pdb.ts`

Simplify the module so each exported function executes its SQL directly.

Expected direction:

- remove `buildPdbSearchQuery()`
- remove `buildPdbDetailQuery()`
- keep `fetchPdbSearchResults(filters)`
- keep `fetchPdbDetail(pdbid)`
- keep `formatResolutionAngstrom(...)`

`fetchPdbSearchResults(filters)` should build one readable `sql` template with the existing filter behavior, including:

- `LIKE '%' || ${value} || '%'` matching for text filters
- conditional resolution filtering only when a resolution is present

`fetchPdbDetail(pdbid)` should also execute one inline raw SQL statement and continue returning either a single row or `null`.

### `src\lib\proteins.ts`

Simplify the module in the same style:

- remove `buildProteinListQuery()`
- remove `buildCreateProteinQuery()`
- remove `buildIncrementFavQuery()`
- remove `buildDeleteProteinQuery()`
- keep the exported CRUD-like functions

Each function should call `db.execute(sql\`...\`)` directly so the read/write logic stays obvious in one place.

### `src\app\search-pdb-simple\page.tsx`

Remove the route-local `Pool` creation and use the shared Drizzle-based access path instead.

The simplest version is:

- either reuse a small `src\lib` helper if that keeps the example clearer
- or execute `db.execute(sql\`...\`)` directly in a tiny local fetch helper

The key requirement is that the page no longer teaches a separate connection lifecycle (`new Pool`, `try/finally`, `pool.end()`).

## Data Flow

The intended data flow stays simple:

1. Route or Server Action receives input.
2. Existing input normalization helpers validate and shape the input.
3. A `src\lib` function executes raw SQL with `db.execute(sql\`...\`)`.
4. The function returns rows or a small normalized result.
5. The route renders the returned data.

Only the execution mechanism changes. Input validation and rendering responsibilities remain where they are today.

## Error Handling

Keep error handling explicit and minimal.

- If `DATABASE_URL` is missing, `src\lib\db.ts` should throw immediately when the connection is first needed.
- Query errors should propagate instead of being swallowed.
- No broad wrapper should catch and convert all database errors.
- Zero-row reads are not errors when the current contract expects an empty array or `null`.

This keeps the example understandable and avoids introducing helper layers that obscure failure behavior.

## Testing Strategy

Keep the verification scope focused on behavior, not on implementation ceremony.

- Update or remove tests that only exist to assert the old `{ text, values }` query-builder helpers.
- Keep validation-focused tests such as `search-filters.ts` and `protein-form.ts` behavior checks.
- Verify that no direct `Pool` usage remains under `src`.
- Verify that existing app behavior still works after the migration.

Success for this migration means:

- `src` no longer creates or exports raw database connections outside `src\lib\db.ts`
- query execution uses `db.execute(sql\`...\`)`
- the existing routes and actions still behave the same from the user's perspective

## Implementation Notes

- Prefer the smallest possible diff that achieves one consistent Drizzle-based pattern.
- Do not add generic database helper wrappers unless they clearly reduce duplication without hiding SQL.
- Keep SQL close to the function that uses it so the example remains readable to beginners.
- If a route-local query becomes too large, move it into `src\lib` rather than introducing another connection pattern.

## Open Decisions Resolved

- All queries use `db.execute(sql\`...\`)`, including `SELECT`.
- Call sites may be reorganized for clarity; strict API compatibility is not required.
- This design covers runtime query execution only, not migration tooling.
- The design intentionally favors simplicity over maximum abstraction.
