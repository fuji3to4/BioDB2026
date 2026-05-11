export default function Home() {
  return (
    <main style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h1>BioDB Next.js Exercise</h1>
      <ul>
        <li>
          <a href="/api/health">GET /api/health</a>
        </li>
        <li>
          <a href="/api/proteins">GET /api/proteins</a>
        </li>
      </ul>
      <p>
        Start this app from the container with <code>npm run dev</code>.
      </p>
    </main>
  );
}
