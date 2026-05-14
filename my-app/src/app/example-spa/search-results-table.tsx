"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table.tsx";

import { PdbDetailPopover } from "./pdb-detail-popover.tsx";
import type { ExampleSpaState } from "./types.ts";

type SearchResultsTableProps = {
  state: ExampleSpaState;
  onOpenDetail: (pdbid: string) => void;
  onCloseDetail: () => void;
};

export function SearchResultsTable({ state, onOpenDetail, onCloseDetail }: SearchResultsTableProps) {
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
              <TableCell>
                <PdbDetailPopover
                  pdbid={row.pdbid}
                  state={state}
                  onOpenDetail={onOpenDetail}
                  onCloseDetail={onCloseDetail}
                />
              </TableCell>
              <TableCell>{row.method}</TableCell>
              <TableCell>
                {row.resolution === null || row.resolution === undefined
                  ? ""
                  : Number.isFinite(Number(row.resolution))
                    ? `${Number(row.resolution).toFixed(2)} Å`
                    : ""}
              </TableCell>
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
