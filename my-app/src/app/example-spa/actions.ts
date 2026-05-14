"use server";

import { normalizeSearchFilters } from "@/lib/search-filters";
import { fetchPdbDetail, fetchPdbSearchResults } from "@/lib/pdb";

import type {
  SpaPdbDetail,
  SpaSearchForm,
  SpaSearchRow,
} from "./types.ts";

export async function searchPdbAction(
  raw: SpaSearchForm,
): Promise<{ ok: true; rows: SpaSearchRow[] } | { ok: false; message: string }> {
  try {
    const filters = normalizeSearchFilters(raw);
    const rows = await fetchPdbSearchResults(filters);
    return { ok: true, rows };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return { ok: false, message: message || "An unexpected error occurred" };
  }
}

export async function getPdbDetailAction(
  pdbid: string,
): Promise<{ ok: true; detail: SpaPdbDetail } | { ok: false; message: string }> {
  try {
    const detail = await fetchPdbDetail(pdbid);

    if (!detail) {
      return { ok: false, message: "PDB entry not found" };
    }

    return { ok: true, detail };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return { ok: false, message: message || "An unexpected error occurred" };
  }
}
