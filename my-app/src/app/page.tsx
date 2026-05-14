import Link from "next/link";


export default async function Home() {
  return (
    <main className="page-shell">
      <section className="card">
        <h1>Welcome to the BioDB Next.js Demo</h1>

        <div className="page-links">
          <Link href="/search-pdb-simple">Go to Simple DB Search Page</Link>
        </div>

        <div className="page-links">
          <Link href="/example">Go to Example Page</Link>
         
        </div>
      </section>
    </main>
  )
};
