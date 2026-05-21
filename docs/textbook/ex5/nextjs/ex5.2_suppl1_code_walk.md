# 演習5 補足1 (Next.js版): コードリーディング

> **対象環境:** Docker Compose (PostgreSQL 17 + PHP/Apache + Next.js 15)
> リポジトリをクローンして `docker compose up` で起動できます。

ここでは [my-app/src/app/example/page.tsx](/my-app/src/app/example/page.tsx) に関して順番に解説します。
演習4.2の例題（[search-pdb-simple/page.tsx](/my-app/src/app/search-pdb-simple/page.tsx)）との違いに注目してください。

```tsx
import Link from "next/link";
import { fetchPdbSearchResults } from "@/lib/pdb";
import { normalizeSearchFilters } from "@/lib/search-filters";

export const dynamic = "force-dynamic";

type HomeProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function ExampleHomePage({ searchParams }: HomeProps) {
  const raw = await searchParams;
  const filters = normalizeSearchFilters({
    id: typeof raw.id === "string" ? raw.id : "",
    name: typeof raw.name === "string" ? raw.name : "",
    org: typeof raw.org === "string" ? raw.org : "",
    res: typeof raw.res === "string" ? raw.res : "",
  });

  const rows = await fetchPdbSearchResults(filters);

  return (
    <main className="page-shell">
      <section className="card">
        <h1>Search Protein Database</h1>
        <form className="search-form" method="get" action="">
          <input name="id" defaultValue={filters.id} placeholder="PDBID" />
          <input name="name" defaultValue={filters.name} placeholder="Protein Name" />
          <input name="org" defaultValue={filters.organism} placeholder="Organism" />
          <input name="res" defaultValue={filters.resolution ?? ""} placeholder="Resolution" />
          <button type="submit">Search</button>
        </form>
      </section>

      <section className="card">
        <p>{rows.length} result(s)</p>
        <table className="data-table">
          <thead>...</thead>
          <tbody>
            {rows.map((row, index) => (
              <tr key={`${row.pdbid}-${row.name}-${index}`}>
                <td><Link href={`/example/pdb/${row.pdbid}`}>{row.pdbid}</Link></td>
                <td>{row.name}</td>
                ...
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

**① import文**

`Link`（Next.jsのリンクコンポーネント）と、ライブラリ関数2つを読み込んでいます。
`fetchPdbSearchResults`：検索条件を受け取りDBを検索する関数（[src/lib/pdb.ts](/my-app/src/lib/pdb.ts) で定義）
`normalizeSearchFilters`：URLパラメータの文字列を検索条件オブジェクトに変換する関数

**② searchParams プロパティ**

演習4.2の例題にはなかった、**このページ最大のポイント**です。
`searchParams` はNext.jsが自動的に渡してくれるプロパティで、URLのクエリパラメータ（`?id=1AGW&res=2.5` の部分）を受け取ります。

```typescript
// URLが /example?id=1AGW&res=2.5 の場合
const raw = await searchParams;
// raw = { id: "1AGW", res: "2.5" }
```

* `searchParams` は非同期（`Promise`）なので `await searchParams` で値を取り出す
* パラメータが未指定の場合は `undefined` になるため、`typeof raw.id === "string"` で安全に取り出す

※PHPの `$_GET['id']` に相当します。

**③ GETメソッドのフォーム**

`<form method="get" action="">` はHTMLの標準的なGETフォームです。
Searchボタンを押すと、フォームの各 `name` の値がURLのクエリパラメータとして付与され、**同じページが再読み込み**されます。

```
// 「id」欄に「1AGW」を入力してSearch → 以下のURLになる
http://localhost:3000/example?id=1AGW
```

Server ComponentはURLが変わると再実行されるため、`searchParams` に新しい値が入り、DBが再検索されます。
※JavaScriptを一切使わずにサーバー側でDBを再検索できるのがServer Componentの強みです。

**④ defaultValue で検索条件を保持**

フォームの各 `<input>` に `defaultValue` を指定することで、検索後も入力欄に条件が残ります。

```tsx
<input name="id" defaultValue={filters.id} placeholder="PDBID" />
```

* `defaultValue`：ページ表示時の初期値（`searchParams` から取り出した値を再表示）
* `placeholder`：入力欄が空のときに薄く表示されるヒントテキスト
* これを省略すると、検索するたびに入力欄がクリアされてしまう

**⑤ fetchPdbSearchResults で条件付き検索**

`filters` オブジェクト（検索条件）をライブラリ関数に渡してDBを検索します。
演習4.2の `fetchRows()` は引数なしでしたが、こちらは検索条件を引数として受け取ります。

```typescript
const rows = await fetchPdbSearchResults(filters);
// filtersが空（全項目未入力）なら全件取得
// filtersに条件があればWHERE句でしぼりこむ
```

**⑥ Link コンポーネントで詳細ページへ**

PDBIDセルに `Link` コンポーネントを使い、詳細ページへのリンクを生成しています。

```tsx
<td>
  <Link href={`/example/pdb/${row.pdbid}`}>{row.pdbid}</Link>
</td>
```

クリックすると `/example/pdb/1AGW` のような詳細ページに移動します（補足資料「段階的なページ表示」参照）。

---

## ⑦ @/lib/pdb.ts と @/lib/search-filters.ts の中身

`page.tsx` が呼び出している `normalizeSearchFilters` と `fetchPdbSearchResults` の実装を確認します。

**normalizeSearchFilters（src/lib/search-filters.ts）**

URLパラメータはすべて文字列です。この関数が型変換・バリデーションを行い、DB検索に使えるオブジェクトに変換します。

```typescript
export function normalizeSearchFilters(raw) {
  return {
    id:       raw.id?.trim()    ?? "",
    name:     raw.name?.trim()  ?? "",
    organism: raw.org?.trim()   ?? "",
    resolution: parseResolutionInput(raw.res),
    // ...
  };
}

function parseResolutionInput(value) {
  if (!value || value.trim() === "") return null; // 未入力はnull
  const parsed = Number(value.trim());
  if (!Number.isFinite(parsed) || parsed <= 0) {
    throw new Error("Resolution must be a positive number");
  }
  return parsed; // 数値に変換して返す
}
```

* `?.trim()`：値が `undefined` でもエラーにならないオプショナルチェーン + 前後スペース除去
* `?? ""`：`null`/`undefined` の場合は空文字を使う（ヌル合体演算子）
* `resolution` のみ数値型に変換。未入力なら `null`（条件なし＝全件対象）

**fetchPdbSearchResults（[src/lib/pdb.ts](/my-app/src/lib/pdb.ts)）**

検索条件を受け取り、SQLで複数テーブルをJOINして検索します。

```typescript
export async function fetchPdbSearchResults(filters) {
  const result = await db.execute(sql`
    select pdb.pdbid, pdb.method, pdb.resolution, pdb.class,
           protein.name, protein.organism
    from pdb
    inner join pdb2protein on pdb.pdbid = pdb2protein.pdbid
    inner join protein on pdb2protein.proteinid = protein.proteinid
    where (pdb.pdbid like '%' || ${filters.id} || '%')
      and (pdb.method like '%' || ${filters.method} || '%')
      and (protein.name like '%' || ${filters.name} || '%')
      and (protein.organism like '%' || ${filters.organism} || '%')
      ${filters.resolution === null
        ? sql``
        : sql`and (pdb.resolution <= ${filters.resolution})`}
  `);
  return result.rows;
}
```

* `like '%' || ${...} || '%'`：部分一致検索。`${...}` でTypeScript変数をSQLに安全に埋め込む（SQLインジェクション対策済み）
* 例：`filters.id = "1AG"` のとき → `like '%1AG%'` → 「1AG」を含む全PDBIDがヒット
* 空文字の場合は `like '%%'` → すべてにマッチ（条件なし）
* `filters.resolution === null ? sql`` : sql`and ...``：resolution が未入力（`null`）なら resolution の WHERE句を追加しない（条件ゼロ＝全件）

※PHPの `WHERE pdbid LIKE :id` + `bindValue` に相当します。Drizzle ORMのテンプレートリテラルが自動でエスケープ処理を行います。

**fetchPdbDetail（[src/lib/pdb.ts](/my-app/src/lib/pdb.ts)）**

PDBIDを指定して1件の詳細データを取得します。

```typescript
export async function fetchPdbDetail(pdbid) {
  const result = await db.execute(sql`
    select pdb.pdbid, pdb.method, pdb.resolution, pdb.chain,
           pdb.positions, to_char(pdb.deposited, 'YYYY-MM-DD') as deposited,
           pdb.class, pdb.url,
           protein.name, protein.organism, protein.len
    from pdb
    inner join pdb2protein on pdb.pdbid = pdb2protein.pdbid
    inner join protein on pdb2protein.proteinid = protein.proteinid
    where pdb.pdbid = ${pdbid}
  `);
  return result.rows[0] ?? null; // 1件だけ取る（なければnull）
}
```

* `where pdb.pdbid = ${pdbid}`：完全一致（`=`）で1件を特定
* `to_char(pdb.deposited, 'YYYY-MM-DD')`：PostgreSQLの日付型を文字列に変換する関数
* `result.rows[0] ?? null`：結果の先頭1件を取る。データがなければ `null` を返す

## 演習4.2との主な違いまとめ

| 項目 | 演習4.2（search-pdb-simple） | 演習5.2（example） |
| --- | --- | --- |
| 検索条件 | なし（全件固定） | `searchParams` で受け取る |
| フォーム | なし | `<form method="get">` |
| 詳細ページリンク | なし | `<Link href={...}>` |
| DB検索関数 | `fetchRows()`（引数なし） | `fetchPdbSearchResults(filters)` |
