# BioDB2026

Next.js App Router implementation of the BioDB examples.

## Routes

- `/` — PDB search form and results
- `/pdb/[pdbid]` — PDB detail page backed by PostgreSQL and `public/pic`
- `/proteins` — Protein list plus create/fav/delete actions

## Commands

```bash
npm install
npm test
npm run lint
npm run build
npm run dev
```

For local builds, set `DATABASE_URL=postgresql://user:password@postgres:5432/demo` when running `npm run build`.