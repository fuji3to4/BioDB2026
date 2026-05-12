import { pool } from "./db";
import type { ProteinInput } from "./protein-form";

export function buildProteinListQuery() {
  return { text: "select * from protein order by proteinid", values: [] };
}

export function buildCreateProteinQuery(input: ProteinInput) {
  return {
    text: "insert into protein(name, organism, len, fav) values ($1, $2, $3, 0)",
    values: [input.name, input.organism, input.length],
  };
}

export function buildIncrementFavQuery(proteinId: number) {
  return {
    text: "update protein set fav = fav + 1 where proteinid = $1",
    values: [proteinId],
  };
}

export function buildDeleteProteinQuery(proteinId: number) {
  return {
    text: "delete from protein where proteinid = $1",
    values: [proteinId],
  };
}

export async function fetchProteins() {
  const query = buildProteinListQuery();
  const result = await pool.query(query);
  return result.rows;
}

export async function createProtein(input: ProteinInput) {
  const query = buildCreateProteinQuery(input);
  await pool.query(query);
}

export async function incrementProteinFav(proteinId: number) {
  const query = buildIncrementFavQuery(proteinId);
  await pool.query(query);
}

export async function deleteProtein(proteinId: number) {
  const query = buildDeleteProteinQuery(proteinId);
  await pool.query(query);
}
