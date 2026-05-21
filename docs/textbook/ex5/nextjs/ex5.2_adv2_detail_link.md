# 演習5 発展2 (Next.js版): 詳細ページのリンク

> **対象環境:** Docker Compose (PostgreSQL 17 + PHP/Apache + Next.js 15)
> リポジトリをクローンして `docker compose up` で起動できます。

検索結果の一覧ページから、各エントリの詳細ページへリンクをたどって移動できる「段階的なページ表示」の仕組みをNext.jsで実装する方法を解説します。

---

## １．仕組みの概要

Next.jsではURLパラメータを**動的ルート（Dynamic Route）**で表現します。
フォルダ名を `[pdbid]` のように角括弧で囲むと、そのフォルダ名部分がURLの動的な値になります。

```
[ブラウザ]
  ↓ フォームで検索
/example               ← 検索結果の一覧、各PDBIDはLinkコンポーネント
  ↓ PDBIDリンクをクリック → /example/pdb/1AGW に遷移
/example/pdb/[pdbid]  ← pdbid="1AGW" を受け取って詳細を表示
```

※PHPの `pdb_detail.php?pdbid=1AGW`（GETパラメータ）に相当しますが、Next.jsではURLのパス自体に値を埋め込みます。

## ２．動的ルートのフォルダ構成

```
my-app/src/app/
└─ example/
   ├─ page.tsx             → /example （一覧ページ）
   └─ pdb/
      └─ [pdbid]/
         └─ page.tsx    → /example/pdb/1AGW 等（詳細ページ）
```

フォルダ名 `[pdbid]` の角括弧が動的ルートのしるしです。
`/example/pdb/1AGW` にアクセスすると、`pdbid` に `"1AGW"` がセットされます。

## ３．一覧ページのリンク生成（[example/page.tsx](/my-app/src/app/example/page.tsx)）

検索結果テーブルのPDBIDセルに、`Link` コンポーネントで詳細ページへのリンクを埋め込みます。

```tsx
import Link from "next/link";

// ...

<td>
  <Link href={`/example/pdb/${row.pdbid}`}>
    {row.pdbid}
  </Link>
</td>
```

* `Link` は Next.js のリンクコンポーネント（`import Link from "next/link"`）
* `` href={`/example/pdb/${row.pdbid}`} `` でURLを動的に生成（テンプレートリテラル）
* クリックすると `/example/pdb/1AGW` のようなURLに遷移する

## ４．詳細ページでのパラメータ受け取り（example/pdb/[pdbid]/page.tsx）

動的ルートの値は `params` プロパティから取得します。

```typescript
import { notFound } from "next/navigation";

type DetailProps = {
  params: Promise<{ pdbid: string }>;
};

export default async function PdbDetailPage({ params }: DetailProps) {
  const { pdbid } = await params;  // URLの [pdbid] 部分を取得
  const detail = await fetchPdbDetail(pdbid);

  if (!detail) {
    notFound();  // 該当なし → 404ページを表示
  }

  // detail を使って表示...
}
```

* `params` は非同期（`Promise`）なので `await params` で値を取り出す
* `{ pdbid }` はフォルダ名 `[pdbid]` と対応している
* `notFound()` を呼ぶと Next.js 標準の404ページが表示される

※PHPの `$_GET['pdbid']` + `die()` に相当します。

## ５．PHP版との比較

| 項目 | PHP版 | Next.js版 |
| --- | --- | --- |
| URLの形式 | `pdb_detail.php?pdbid=1AGW` | `/example/pdb/1AGW` |
| パラメータ取得 | `$_GET['pdbid']` | `const { pdbid } = await params` |
| リンク生成 | `<a href="pdb_detail.php?pdbid=...">` | `` <Link href={`/example/pdb/${row.pdbid}`}> `` |
| エラー処理 | `die('エラーメッセージ')` | `notFound()`（標準404ページ） |
