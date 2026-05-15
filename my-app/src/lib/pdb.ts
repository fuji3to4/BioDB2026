import { sql } from "drizzle-orm";

import { db } from "./db.ts";
import type { SearchFilters } from "./search-filters.ts";

// Raw execute results can surface numeric columns as strings depending on driver mapping.
type PdbSearchRow = {
  pdbid: string;
  method: string;
  resolution: number | string | null;
  class: string;
  name: string;
  organism: string;
};

// Raw execute results can surface numeric columns as strings depending on driver mapping.
type PdbDetailRow = {
  pdbid: string;
  method: string;
  resolution: number | string | null;
  chain: string | null;
  positions: string | null;
  deposited: string | null;
  class: string;
  url: string | null;
  name: string;
  organism: string;
  len: number | null;
};

export async function fetchPdbSearchResults(filters: SearchFilters) {
  const result = await db.execute(sql`
    select pdb.pdbid, pdb.method, pdb.resolution, pdb.class, protein.name, protein.organism
    from pdb
    inner join pdb2protein on pdb.pdbid = pdb2protein.pdbid
    inner join protein on pdb2protein.proteinid = protein.proteinid
    where (pdb.pdbid like '%' || ${filters.id} || '%')
      and (pdb.method like '%' || ${filters.method} || '%')
      and (protein.name like '%' || ${filters.name} || '%')
      and (pdb.class like '%' || ${filters.className} || '%')
      and (protein.organism like '%' || ${filters.organism} || '%')
      ${filters.resolution === null ? sql`` : sql`and (pdb.resolution <= ${filters.resolution})`}
  `);

  return result.rows as PdbSearchRow[];
}

export async function fetchPdbDetail(pdbid: string) {
  const result = await db.execute(sql`
    select pdb.pdbid, pdb.method, pdb.resolution, pdb.chain, pdb.positions,
           to_char(pdb.deposited, 'YYYY-MM-DD') as deposited, pdb.class, pdb.url,
           protein.name, protein.organism, protein.len
    from pdb
    inner join pdb2protein on pdb.pdbid = pdb2protein.pdbid
    inner join protein on pdb2protein.proteinid = protein.proteinid
    where (pdb.pdbid = ${pdbid})
  `);

  return (result.rows[0] ?? null) as PdbDetailRow | null;
}

export function formatResolutionAngstrom(resolution: number | string | null | undefined) {
  if (resolution === null || resolution === undefined) return "";
  const n = Number(resolution);
  return Number.isFinite(n) ? `${n.toFixed(2)} Å` : "";
}
