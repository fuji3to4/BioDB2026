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


```powershell
cp .env.example .env
npm install
npm run dev
```

その後、次を開いてください。

- [`http://localhost:3000/`](http://localhost:3000/)

※`npm run dev`は開発用にNext.jsを起動させます。アクセスする度にコードの変更が反映されるため、開発中はこのコマンドを実行したままで大丈夫です。ただしコンパイルが毎回入るので若干重くなります。
以下のコマンドは本番用にNext.jsをビルドして起動させるコマンドです。一度ビルドしてしまえば、コードの変更があっても再度ビルドしない限り反映されないため、ウェブアプリを軽く動かすことができます。

```bash
npm run build
npm start
```
