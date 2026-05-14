import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { fetchPdbDetail, formatResolutionAngstrom } from "@/lib/pdb";
import { EXAMPLE_SEARCH_PATH } from "@/lib/routes";

type DetailProps = {
  params: Promise<{ pdbid: string }>;
};

export default async function PdbDetailPage({ params }: DetailProps) {
  const { pdbid } = await params;
  const detail = await fetchPdbDetail(pdbid);

  if (!detail) {
    notFound();
  }

  return (
    <main className="page-shell">
      <section className="card detail-grid">
        <div>
          <p><Link href={EXAMPLE_SEARCH_PATH}>Back to search</Link></p>
          <h1>{detail.pdbid}</h1>
          <h2>{detail.name}</h2>
          <p><strong>Organism:</strong> {detail.organism}</p>
          <p><strong>Protein length:</strong> {detail.len} AA</p>
          <ul>
            <li><strong>Chain:</strong> {detail.chain}</li>
            <li><strong>Positions:</strong> {detail.positions}</li>
            <li><strong>Deposited:</strong> {detail.deposited}</li>
            <li><strong>Method:</strong> {detail.method}</li>
            <li><strong>Resolution:</strong> {formatResolutionAngstrom(detail.resolution)}</li>
          </ul>
          <p><a href={detail.url} target="_blank" rel="noreferrer">Open PDB reference</a></p>
        </div>
        <div>
          <Image
            src={`/pic/${detail.pdbid.toLowerCase()}.jpeg`}
            alt={`${detail.pdbid} structure`}
            width={500}
            height={500}
            loading="eager"
            style={{ width: "100%", height: "auto" }}
          />
        </div>
      </section>
    </main>
  );
}