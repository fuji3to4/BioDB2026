import Link from "next/link";
import { fetchPdbSearchResults } from "@/lib/pdb";
import { normalizeSearchFilters } from "@/lib/search-filters";

export const dynamic = "force-dynamic";

type HomeProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function ExampleHomePage({ searchParams }: HomeProps) {
  const raw = await searchParams;
  let filters: ReturnType<typeof normalizeSearchFilters>;
  const base = {
    id: typeof raw.id === "string" ? raw.id : "",
    method: typeof raw.method === "string" ? raw.method : "",
    name: typeof raw.name === "string" ? raw.name : "",
    class: typeof raw.class === "string" ? raw.class : "",
    org: typeof raw.org === "string" ? raw.org : "",
  };

  try {
    filters = normalizeSearchFilters({ ...base, res: typeof raw.res === "string" ? raw.res : "" });
  } catch (error) {
    console.warn("Invalid search parameters; ignoring resolution filter", error);
    filters = normalizeSearchFilters({ ...base, res: "" });
  }

  const rows = await fetchPdbSearchResults(filters);

  return (
    <main className="page-shell">
      <section className="card">
        <div className="page-links">
          <Link href="/example/proteins">Protein Management</Link>
        </div>
        <h1>Search Protein Database</h1>
        <form className="search-form" method="get" action="">
          <input name="id" defaultValue={filters.id} placeholder="PDBID" />
          <input name="name" defaultValue={filters.name} placeholder="Protein Name" />
          <input name="method" defaultValue={filters.method} placeholder="Method" />
          <input name="org" defaultValue={filters.organism} placeholder="Organism" />
          <input name="res" defaultValue={filters.resolution ?? ""} placeholder="Resolution" />
          <select name="class" defaultValue={filters.className} aria-label="Protein class">
            <option value="">Any</option>
            <option value="Enzyme">Enzyme</option>
            <option value="DNA-Binding">DNA-binding</option>
            <option value="Membrane">Membrane</option>
            <option value="Signaling Protein">Signaling Protein</option>
            <option value="Protein Binding">Protein Binding</option>
            <option value="Membrene">Membrene</option>
          </select>
          <button type="submit">Search</button>
        </form>
      </section>

      <section className="card">
        <p>{rows.length} result(s)</p>
        <table className="data-table">
          <thead>
            <tr>
              <th>PDBID</th>
              <th>Method</th>
              <th>Resolution</th>
              <th>Class</th>
              <th>Protein Name</th>
              <th>Organism</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr key={`${row.pdbid}-${row.name}-${index}`}>
                <td><Link href={`/example/pdb/${row.pdbid}`}>{row.pdbid}</Link></td>
                <td>{row.method}</td>
                <td>{row.resolution}</td>
                <td>{row.class}</td>
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