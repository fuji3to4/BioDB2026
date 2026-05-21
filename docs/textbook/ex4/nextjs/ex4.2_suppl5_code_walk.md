# 演習4 補足5 (Next.js版): コードの読み方

> **対象環境:** Docker Compose (PostgreSQL 17 + PHP/Apache + Next.js 15)
> リポジトリをクローンして `docker compose up` で起動できます。

ここでは演習4.2の例題プログラム [`my-app/src/app/search-pdb-simple/page.tsx`](/my-app/src/app/search-pdb-simple/page.tsx) を順番に解説します。

```tsx
import { sql } from "drizzle-orm";

import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

type SimplePdbRow = {
  pdbid: string;
  resolution: number | string | null;
  name: string;
  organism: string;
};

async function fetchRows(): Promise<SimplePdbRow[]> {
  const result = await db.execute(sql`
    select pdb.pdbid, pdb.resolution, protein.name, protein.organism
    from pdb
    inner join pdb2protein on pdb.pdbid = pdb2protein.pdbid
    inner join protein on pdb2protein.proteinid = protein.proteinid
    where pdb.resolution <= 2.5
  `);

  return result.rows as SimplePdbRow[];
}

export default async function SearchPdbSimplePage() {
  const rows = await fetchRows();

  return (
    <main className="page-shell">
      <section className="card">
        <h1>Search Result (Simple)</h1>
        <p>{rows.length} result(s)</p>

        <table className="data-table">
          <thead>
            <tr>
              <th>PDBID</th>
              <th>Resolution</th>
              <th>Protein name</th>
              <th>Organism</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr key={`${row.pdbid}-${row.name}-${index}`}>
                <td>{row.pdbid}</td>
                <td>{row.resolution}</td>
                <td>{row.name}</td>
                <td>{row.organism}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </main>
  );
}
```

---

## プログラムの解説

**① import文（1〜3行目）**

Drizzle ORMの `sql` タグと、DB接続オブジェクト `db` を読み込んでいます。
`@/lib/db` の `@/` は `src/` フォルダを指すエイリアスです。
※PHPの `require_once` に相当します。

**② export const dynamic = "force-dynamic"（5行目）**

毎回データベースを問い合わせて最新の結果を表示するための設定です。
これを書かないと古いデータがキャッシュされて表示されることがあります（補足資料s3参照）。

**③ type定義（7〜12行目）**

DB検索結果の1行分のデータ構造をTypeScriptの型として定義しています。
列名と型を指定することで、コード補完が効くようになります。

`number | string | null` は「数値・文字列・nullのいずれか」という意味です。
`resolution`（解像度）は小数値ですが、DBから返る型が一定でないためこのように定義しています。

**④ fetchRows関数（14〜24行目）**

DB問い合わせを行う関数です。`async function` なので非同期処理です（補足資料s1参照）。
`` db.execute(sql`...`) `` でSQL文を実行し、`result.rows` で結果の配列を得ます。
`as SimplePdbRow[]` でTypeScriptに型を教えています。
※PHPの `$stmh->execute()` + `fetchAll()` に相当します。

**⑤ SearchPdbSimplePage コンポーネント（26〜58行目）**

`export default async function` で定義されたServer Componentです（補足資料s3参照）。
`async` なので、内部で `await fetchRows()` を呼び出せます。
取得した `rows` 配列をJSXの中で使ってHTMLを構築しています。

**⑥ JSXによるテーブル表示（35〜54行目）**

`<table>` の中で `rows.map()` を使ってデータを1行ずつ表示しています（補足資料s2参照）。

```tsx
{rows.map((row, index) => (
  <tr key={`${row.pdbid}-${row.name}-${index}`}>
    <td>{row.pdbid}</td>
  </tr>
))}
```

* `rows.map()` で配列の各要素に対して1つの `<tr>` を生成
* `key` 属性はReactが各要素を識別するために必要（リストを表示するときは必須）
* `{row.pdbid}` のように `{}` でJSX内にデータを埋め込む
