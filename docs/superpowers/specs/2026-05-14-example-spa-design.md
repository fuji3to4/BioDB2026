# Example SPA Search Experience Design

## Problem

The current `E:\Data\App\BioDB2026\my-app\src\app` implementation demonstrates Server Components and Server Actions, but it does not yet deliver the React-heavy SPA feel of `E:\Data\App\BioDB\my-app\app`. The goal is to add a new route at `src\app\example-spa` that preserves the existing data-access logic in `src\lib`, but presents search and detail interactions in a more client-driven way using shadcn and Tailwind CSS.

## Goals

- Create a new SPA-style search experience at `src\app\example-spa`.
- Reuse the current `src\lib\pdb.ts` and `src\lib\search-filters.ts` logic instead of duplicating query or normalization code.
- Make the UI feel React-first: local state drives the screen, search updates automatically after a debounce, and detail data loads on demand.
- Keep the result list visible while showing detail in a popover, similar to the older app.
- Use shadcn and Tailwind CSS as the styling and component foundation.
- Preserve the older SPA's method filter by extending the shared `src\lib` search model instead of inventing route-local filtering logic.

## Non-Goals

- Replacing the existing `src\app\example` route.
- Adding query-parameter persistence or shareable URL state.
- Including proteins management in this SPA route.
- Refactoring unrelated `src\lib` modules beyond what is needed to support the new route cleanly.

## Recommended Approach

Use a client-led SPA route backed by thin Server Actions.

The new `src\app\example-spa\page.tsx` route acts as the entry point, but the main interaction model lives in client components. Search form input, current result rows, the selected PDB ID, loading states, and error states all live in client state. Server Actions remain responsible for validating inputs and calling the shared `src\lib` functions.

This approach preserves the current database logic, keeps the UI highly interactive, and matches the user's preference for React-driven state over URL-driven navigation.

## Route and Component Structure

### Route

- `src\app\example-spa\page.tsx`
  - Renders the top-level screen for the new SPA example.
  - Hosts or composes the main client shell.

### Client-facing components

- `example-spa-client-shell`
  - Owns page-level state and orchestration.
  - Coordinates search execution and detail fetching.
- `search-form`
  - Controlled inputs for PDB ID, method, resolution, class, protein name, and organism.
  - Emits local state changes immediately.
- `search-results-table`
  - Displays current rows.
  - Triggers detail loading when a PDB ID is selected.
- `pdb-detail-popover`
  - Anchored to the selected result row.
  - Shows loading, error, empty, and success states for the selected PDB detail.
- Optional small UI helpers
  - Skeleton, empty-state, and alert components where they improve clarity.

### Server-side helpers

- `src\app\example-spa\actions.ts`
  - Thin Server Actions that normalize inputs and call `src\lib`.
  - No duplicated SQL or business rules.

## Data Flow

### Search flow

1. The client shell initializes local state with empty filters and no selected detail.
2. The user types into controlled form inputs.
3. Input changes are debounced before search execution.
4. After the debounce interval, the client triggers a search Server Action.
5. The Server Action normalizes inputs through the shared filter utilities.
6. Search results are fetched through `fetchPdbSearchResults`.
7. The client updates `results`, clears any stale search error, and preserves the rest of the screen state.

### Detail flow

1. The user clicks a PDB ID in the table.
2. The client stores the selected PDB ID and opens the popover for that row.
3. The client triggers detail loading only for that selection.
4. A detail Server Action calls `fetchPdbDetail`.
5. The popover updates independently with loading, error, or detail content.

## State Model

The client shell manages the following state:

- `filters`
- `results`
- `selectedPdbId`
- `selectedDetail`
- `isSearching`
- `isDetailLoading`
- `searchError`
- `detailError`

This keeps the interaction model fully local and avoids coupling the screen to query parameters.

## Shared Library Changes

The current shared search helpers do not yet cover the older SPA's `method` filter. To keep `example-spa` aligned with the reuse requirement, the shared library should be extended rather than bypassed.

- Extend `SearchFilters` in `src\lib\search-filters.ts` to include `method`.
- Extend normalization to trim and validate the method field consistently with the other text filters.
- Extend `buildPdbSearchQuery` in `src\lib\pdb.ts` to include the method predicate.

This keeps the filtering contract shared across examples and avoids a special-case search path only for the new SPA route.

## UI Design

The screen uses shadcn and Tailwind CSS rather than the current custom global class approach.

### Main screen

- A page header introducing the SPA example.
- A search card containing the controlled filter form.
- A results card containing the data table.

### Table behavior

- Each result row shows PDB ID, method, resolution, class, protein name, and organism.
- The PDB ID is the interactive trigger.
- Selecting a PDB ID opens a popover instead of navigating away or opening a dedicated side panel.

### Popover behavior

The popover should present:

- Image for the selected structure
- Method
- Resolution
- Chain
- Positions
- Deposited date
- Class
- Protein name
- Organism
- Length
- External PDB link

The design should feel close to the original SPA while using shadcn primitives and current Next.js patterns.

## Error Handling

### Search errors

- Failed searches show a visible alert above or inside the results area.
- Existing rows may remain visible until replaced by a successful response, unless the implementation explicitly clears them.

### Detail errors

- Detail failures are isolated to the popover content.
- A detail fetch failure must not break the table or reset the active filters.

### Input validation

- Resolution parsing continues to use the existing validation path in `src\lib\search-filters.ts`.
- Invalid input surfaces as a user-visible error rather than failing silently.

## Testing Strategy

- Keep the existing `src\lib` tests as the main coverage for query building and validation behavior.
- Add focused tests only where the new route introduces meaningful new logic, such as route-local request shaping or client-side state helpers if extracted into testable utilities.
- Avoid broad test scaffolding for the UI unless the repository already supports it.

## Implementation Notes

- Prefer reusing current `src\lib` exports over introducing duplicate helpers under `example-spa`.
- Keep server-side entry points thin and explicit.
- Keep client components narrowly scoped so the SPA route remains understandable and easy to evolve.
- Add shadcn dependencies and generated primitives only as needed for the selected UI pieces.

## Open Decisions Resolved

- Scope is limited to search and detail display.
- Protein management is out of scope for this route.
- URL state restoration is not required.
- Detail display uses a popover, not a side panel.
- The new work lives under `src\app\example-spa`.
