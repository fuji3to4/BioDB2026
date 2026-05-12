import Link from "next/link";

export default function ProteinsPage() {
  return (
    <main className="page-shell">
      <section className="card">
        <h1>Protein Management</h1>
        <p>This page is a temporary placeholder for the upcoming protein management work.</p>
        <p>It exists now so the header link does not lead to a 404.</p>
        <p>Use the PDB search for now, and check back in a later task for the real feature.</p>
        <p>
          <Link href="/">Back to search</Link>
        </p>
      </section>
    </main>
  );
}
