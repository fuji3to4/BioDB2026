# BioDB2026

BioDB サンプルを Next.js App Router で実装したアプリです。

## Routes

- `/` - 各サンプルページへのトップページ
- `/search-pdb-simple` - 単純な SQL 検索結果ページ
- `/example` - 検索フォームと結果一覧（サーバー描画）
- `/example/pdb/[pdbid]` - PDB 詳細ページ（PostgreSQL + `public/pic` 画像）
- `/example/proteins` - Protein 一覧と作成・Fav 加算・削除
- `/example-spa` - クライアント状態管理つきの SPA サンプル

## Commands

```bash
npm install
npm test
npm run lint
npm run build
npm run dev
```
