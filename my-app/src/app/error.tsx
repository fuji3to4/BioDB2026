"use client";

import { useEffect } from "react";

type ErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function GlobalError({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="page-shell">
      <section className="card">
        <h1>Something went wrong</h1>
        <p>We could not load this page right now.</p>
        <p>Please try again.</p>
        <button type="button" onClick={reset}>Retry</button>
      </section>
    </main>
  );
}
