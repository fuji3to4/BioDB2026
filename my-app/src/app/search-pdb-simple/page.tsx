import { Pool } from "pg";

export const dynamic = "force-dynamic";

type SimplePdbRow = {
  pdbid: string;
  resolution: number | string | null;
  name: string;
  organism: string;
};

async function fetchRows(): Promise<SimplePdbRow[]> {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL is not set");
  }

  const pool = new Pool({ connectionString });

  try {
    const result = await pool.query<SimplePdbRow>(`
      SELECT pdb.pdbid, pdb.resolution, protein.name, protein.organism
      FROM pdb INNER JOIN pdb2protein ON pdb.pdbid = pdb2protein.pdbid INNER JOIN protein ON pdb2protein.proteinid = protein.proteinid
      WHERE pdb.resolution <= 2.5
    `);

    return result.rows;
  } finally {
    await pool.end();
  }
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
