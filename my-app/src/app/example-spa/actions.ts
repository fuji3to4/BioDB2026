"use server";

import { normalizeSearchFilters } from "@/lib/search-filters";
import { fetchPdbDetail, fetchPdbSearchResults } from "@/lib/pdb";

import type {
  SpaPdbDetail,
  SpaSearchForm,
  SpaSearchRow,
} from "./types.ts";

export async function searchPdbAction(raw: SpaSearchForm): Promise<SpaSearchRow[]> {
  const filters = normalizeSearchFilters(raw);
  return fetchPdbSearchResults(filters);
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
