import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { fetchPdbSearchResults } from "@/lib/pdb";
import { normalizeSearchFilters } from "@/lib/search-filters";

type HomeProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function Home({ searchParams }: HomeProps) {
  const raw = await searchParams;
  let filters: ReturnType<typeof normalizeSearchFilters>;
  const base = {
    id: typeof raw.id === "string" ? raw.id : "",
    name: typeof raw.name === "string" ? raw.name : "",
    class: typeof raw.class === "string" ? raw.class : "",
    org: typeof raw.org === "string" ? raw.org : "",
  };
  try {
    filters = normalizeSearchFilters({ ...base, res: typeof raw.res === "string" ? raw.res : "" });
  } catch (e) {
    // If parsing search params fails (e.g. invalid ?res=abc), ignore the resolution filter and continue.
    // This keeps the search page from crashing while preserving other filters and UI.

    console.warn("Invalid search parameters; ignoring resolution filter", e);
    filters = normalizeSearchFilters({ ...base, res: "" });
  }
  const rows = await fetchPdbSearchResults(filters);

  return (
    <main className="page-shell">
      <SiteHeader />
      <section className="card">
        <h1>Search Protein Database</h1>
        <form className="search-form">
          <input name="id" defaultValue={filters.id} placeholder="PDBID" />
          <input name="name" defaultValue={filters.name} placeholder="Protein Name" />
          <input name="org" defaultValue={filters.organism} placeholder="Organism" />
          <input name="res" defaultValue={filters.resolution ?? ""} placeholder="Resolution" />
          <select name="class" defaultValue={filters.className}>
            <option value="">Any</option>
            <option value="Enzyme">Enzyme</option>
            <option value="DNA-Binding">DNA-binding</option>
            <option value="Membrane">Membrane</option>
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
            {rows.map((row) => (
              <tr key={`${row.pdbid}-${row.name}`}>
                <td><Link href={`/pdb/${row.pdbid}`}>{row.pdbid}</Link></td>
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
