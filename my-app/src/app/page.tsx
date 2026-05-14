import Link from "next/link";


export default async function Home() {
  return(
    <main className="page-shell">
      <section className="card">
        <h1>Welcome to the BioDB Next.js Demo</h1>  

        <Link href="/example">Go to Example Page</Link>
      </section>
    </main>
  )
  };
