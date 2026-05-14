import Link from "next/link";


export default async function Home() {
  return(
    <main className="page-shell">
      <section className="card">
        <h1>Welcome to the BioDB Next.js Demo</h1>  
        <p>This demo application showcases how to build a simple protein database search and management interface using Next.js. You can search for protein structures from the Protein Data Bank (PDB) and manage your own list of proteins using Server Actions.</p>
        <p>To get started, click the link below to explore the example features:</p>
        <Link href="/example">Go to Example Page</Link>
      </section>
    </main>
  )
  };
