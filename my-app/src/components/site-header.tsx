import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="site-header">
      <nav className="site-nav">
        <Link href="/">PDB Search</Link>
        <Link href="/proteins">Protein Management</Link>
      </nav>
    </header>
  );
}
