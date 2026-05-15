"use client";

import { useEffect, useRef, useState } from "react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert.tsx";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card.tsx";

import { getPdbDetailAction, searchPdbAction } from "./actions.ts";
import {
  createInitialSpaState,
  clearDetailSelection,
  finishDetailError,
  finishDetailSuccess,
  finishSearchError,
  finishSearchSuccess,
  startSearch,
  startDetailLoad,
} from "./client-state.ts";
import { SearchForm } from "./search-form.tsx";
import { SearchResultsTable } from "./search-results-table.tsx";
import type { SpaSearchForm } from "./types.ts";

const DEBOUNCE_MS = 250;

export default function ExampleSpaClientShell() {
  const [state, setState] = useState(createInitialSpaState);
  const searchRequestId = useRef(0);
  const detailRequestId = useRef(0);

  useEffect(() => {
    const requestId = ++searchRequestId.current;
    const filters = state.filters;

    const timeoutId = setTimeout(() => {
      void (async () => {
        const result = await searchPdbAction(filters);

        if (searchRequestId.current !== requestId) {
          return;
        }

        setState((current) => {
          if (result.ok) {
            return finishSearchSuccess(current, result.rows);
          }

          return finishSearchError(current, result.message);
        });
      })();
    }, DEBOUNCE_MS);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [state.filters]);

  const handleFiltersChange = (nextFilters: SpaSearchForm) => {
    setState((current) => startSearch(current, nextFilters));
  };

  const handleDetailOpen = (pdbid: string) => {
    const requestId = ++detailRequestId.current;
    setState((current) => startDetailLoad(current, pdbid));

    void (async () => {
      const result = await getPdbDetailAction(pdbid);

      if (detailRequestId.current !== requestId) {
        return;
      }

      setState((current) => {
        if (result.ok) {
          return finishDetailSuccess(current, result.detail);
        }

        return finishDetailError(current, result.message);
      });
    })();
  };

  const handleDetailClose = () => {
    detailRequestId.current += 1;
    setState((current) => clearDetailSelection(current));
  };

  return (
    <main className="page-shell">
      <section className="card">
        <h1>Example SPA Search</h1>
        <p>Debounced client-side shell for searching PDB entries.</p>
      </section>

      <Card>
        <CardHeader>
          <CardTitle>Search</CardTitle>
          <CardDescription>Update the filters below to refresh results.</CardDescription>
        </CardHeader>
        <CardContent>
          <SearchForm filters={state.filters} onChange={handleFiltersChange} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Results</CardTitle>
          <CardDescription>
            {state.isSearching ? "Searching..." : `${state.results.length} result(s)`}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {state.searchError ? (
            <Alert>
              <AlertTitle>Search failed</AlertTitle>
              <AlertDescription>{state.searchError}</AlertDescription>
            </Alert>
          ) : null}

          <SearchResultsTable
            state={state}
            onOpenDetail={handleDetailOpen}
            onCloseDetail={handleDetailClose}
          />
        </CardContent>
      </Card>
    </main>
  );
}
