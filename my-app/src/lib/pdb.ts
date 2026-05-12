import { pool } from "./db";
import type { SearchFilters } from "./search-filters";

export function buildPdbSearchQuery(filters: SearchFilters) {
  const textParts = [
    "select pdb.pdbid, pdb.method, pdb.resolution, pdb.class, protein.name, protein.organism",
    "from pdb natural join pdb2protein natural join protein",
    "where (pdb.pdbid like $1)",
    "and (protein.name like $2)",
    "and (pdb.class like $3)",
    "and (protein.organism like $4)",
  ];

  const values: Array<string | number> = [
    `%${filters.id}%`,
    `%${filters.name}%`,
    `%${filters.className}%`,
    `%${filters.organism}%`,
  ];

  if (filters.resolution !== null) {
    textParts.push("and (pdb.resolution <= $5)");
    values.push(filters.resolution);
  }

  return { text: textParts.join("\n"), values };
}

export function buildPdbDetailQuery(pdbid: string) {
  return {
    text: `
      select pdb.pdbid, pdb.method, pdb.resolution, pdb.chain, pdb.positions,
             pdb.deposited, pdb.class, pdb.url, protein.name, protein.organism, protein.len
      from pdb natural join pdb2protein natural join protein
      where (pdb.pdbid = $1)
    `,
    values: [pdbid],
  };
}

export async function fetchPdbSearchResults(filters: SearchFilters) {
  const query = buildPdbSearchQuery(filters);
  const result = await pool.query(query);
  return result.rows;
}
