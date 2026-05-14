"use client";

// Local client-safe helper to format resolution (avoids importing server-only module)
function formatResolutionAngstrom(resolution: number | string | null | undefined) {
  if (resolution === null || resolution === undefined) return "";
  const n = Number(resolution);
  return Number.isFinite(n) ? `${n.toFixed(2)} Å` : "";
}

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table.tsx";

import type { ExampleSpaState } from "./types.ts";

type SearchResultsTableProps = {
  state: ExampleSpaState;
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
          <TableHead>Protein name</TableHead>
          <TableHead>Organism</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {state.results.length ? (
          state.results.map((row) => (
            <TableRow key={row.pdbid}>
              <TableCell>{row.pdbid}</TableCell>
              <TableCell>{row.method}</TableCell>
              <TableCell>{formatResolutionAngstrom(row.resolution)}</TableCell>
              <TableCell>{row.class}</TableCell>
              <TableCell>{row.name}</TableCell>
              <TableCell>{row.organism}</TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={6}>{state.isSearching ? "Searching..." : "No results."}</TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
