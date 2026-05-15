import { sql } from "drizzle-orm";

import { db } from "./db.ts";
import type { ProteinInput } from "./protein-form.ts";

export type ProteinRow = {
  proteinid: number;
  name: string;
  organism: string;
  len: number;
  fav: number;
};

export async function fetchProteins() {
  const result = await db.execute(sql`
    select proteinid, name, organism, len, fav
    from protein
    order by proteinid
  `);
  return result.rows as ProteinRow[];
}

export async function createProtein(input: ProteinInput) {
  await db.execute(sql`
    insert into protein(name, organism, len, fav)
    values (${input.name}, ${input.organism}, ${input.length}, 0)
  `);
}

export async function incrementProteinFav(proteinId: number) {
  await db.execute(sql`
    update protein
    set fav = fav + 1
    where proteinid = ${proteinId}
  `);
}

export async function deleteProtein(proteinId: number) {
  await db.execute(sql`
    delete from protein
    where proteinid = ${proteinId}
  `);
}
