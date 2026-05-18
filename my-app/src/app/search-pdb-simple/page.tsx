import { sql } from "drizzle-orm";

import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

type SimplePdbRow = {
  pdbid: string;
  resolution: number | string | null;
  name: string;
  organism: string;
};

async function fetchRows(): Promise<SimplePdbRow[]> {
  const result = await db.execute(sql`
    select pdb.pdbid, pdb.resolution, protein.name, protein.organism
    from pdb
    inner join pdb2protein on pdb.pdbid = pdb2protein.pdbid
    inner join protein on pdb2protein.proteinid = protein.proteinid
    where pdb.resolution <= 2.5
  `);

  return result.rows as SimplePdbRow[];
}

export default async function SearchPdbSimplePage() {
  const rows = await fetchRows();

  return (
    <main className="page-shell">
      <section className="card">
        <h1>Search Result (Simple)</h1>
        <p>{rows.length} result(s)</p>

        <table className="data-table">
          <thead>
            <tr>
              <th>PDBID</th>
              <th>Resolution</th>
              <th>Protein name</th>
              <th>Organism</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr key={`${row.pdbid}-${row.name}-${index}`}>
                <td>{row.pdbid}</td>
                <td>{row.resolution}</td>
                <td>{row.name}</td>
                <td>{row.organism}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </main>
  );
}
