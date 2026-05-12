import { ConfirmDeleteButton } from "@/components/confirm-delete-button";
import { ProteinCreateForm } from "./protein-create-form";
import {
  deleteProteinAction,
  incrementProteinFavAction,
} from "./actions";
import { fetchProteins } from "@/lib/proteins";

export const dynamic = "force-dynamic";

export default async function ProteinsPage() {
  const proteins = await fetchProteins();

  return (
    <main className="page-shell">
      <section className="card">
        <h1>Protein Management</h1>
        <ProteinCreateForm />
      </section>

      <section className="card">
        <h2>Existing proteins</h2>
        <table className="data-table proteins-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Organism</th>
              <th>Length</th>
              <th>Fav</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {proteins.length ? (
              proteins.map((protein) => (
                <tr key={protein.proteinid}>
                  <td>{protein.proteinid}</td>
                  <td>{protein.name}</td>
                  <td>{protein.organism}</td>
                  <td>{protein.len}</td>
                  <td>{protein.fav}</td>
                  <td className="protein-actions">
                    <form action={incrementProteinFavAction.bind(null, protein.proteinid)}>
                      <button type="submit">+1 Fav</button>
                    </form>
                    <form action={deleteProteinAction.bind(null, protein.proteinid)}>
                      <ConfirmDeleteButton className="danger-button">Delete</ConfirmDeleteButton>
                    </form>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6}>No proteins yet.</td>
              </tr>
            )}
          </tbody>
        </table>
      </section>
    </main>
  );
}
