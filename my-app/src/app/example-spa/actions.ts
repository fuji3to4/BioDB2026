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
): Promise<{ ok: true; results: SpaSearchRow[] } | { ok: false; message: string }> {
  try {
    const filters = normalizeSearchFilters(raw);
    const results = await fetchPdbSearchResults(filters);
    return { ok: true, results };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return { ok: false, message: message || "An unexpected error occurred" };
  }
}

export async function getPdbDetailAction(
  pdbid: string,
): Promise<{ detail: SpaPdbDetail; error: null } | { detail: null; error: string }> {
  const detail = await fetchPdbDetail(pdbid);

  if (!detail) {
    return { detail: null, error: "PDB entry not found" };
  }

  return { detail, error: null };
}
