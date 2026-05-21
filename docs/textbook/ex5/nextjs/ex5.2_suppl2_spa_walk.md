# 演習5 補足2 (Next.js版): SPAコードの解説

> **対象環境:** Docker Compose (PostgreSQL 17 + PHP/Apache + Next.js 15)
> リポジトリをクローンして `docker compose up` で起動できます。

ここでは演習5.2の発展課題（SPA版）のサンプルプログラム [my-app/src/app/example-spa/](../../../../my-app/src/app/example-spa/) を解説します。
演習4.2・5.2の例題（Server Component）との違いに注目してください。

---

## １．SPAとは何か

**SPA（Single Page Application）**とは、ページ全体を再読み込みせずにデータを更新するWebアプリケーションの形式です。

| 項目 | Server Component（例題） | SPA（この発展課題） |
| --- | --- | --- |
| 実行場所 | サーバー側 | ブラウザ側（クライアント） |
| 検索のトリガー | フォーム送信 → ページ再読み込み | 入力するたびに自動で検索（ページ再読み込みなし） |
| DB接続 | コンポーネントから直接 | Server Action（サーバー関数の呼び出し）経由 |

## ２．ファイル構成

```
example-spa/
├─ page.tsx               ← メインのClient Component（状態管理・イベント処理）
├─ search-form.tsx        ← 検索フォームコンポーネント
├─ search-results-table.tsx ← 検索結果テーブルコンポーネント
├─ pdb-detail.tsx         ← 詳細ポップオーバーコンポーネント
├─ actions.ts             ← Server Action（DBアクセス）
├─ client-state.ts        ← 状態遷移の純粋関数
└─ types.ts               ← 型定義
```

## ３．"use client" と "use server"

このSPAでは2種類のファイルが使われています。

**"use client"（クライアントコンポーネント）**

```typescript
"use client"; // ← ファイル先頭に記述

import { useState, useEffect } from "react"; // ← ブラウザ側のReact機能が使える
```

`useState` や `useEffect` など、ブラウザのインタラクション（ユーザー操作への反応）が必要なコンポーネントに使います。
注意：Client ComponentからはDBに直接アクセスできません。

**"use server"（Server Action）**

```typescript
"use server"; // ← ファイル先頭に記述（actions.ts）

export async function searchPdbAction(filters) {
  // ここはサーバー側で実行される → DBアクセスOK
  const rows = await fetchPdbSearchResults(filters);
  return { ok: true, rows };
}
```

Client ComponentからServer Actionを呼び出すことで、ページ再読み込みなしにDBを検索できます。
※Client Component → Server Action → DB という経路でデータを取得します。

## ４．useState による状態管理

`useState` は、コンポーネントが持つ「状態（データ）」を管理するReactのフックです。
状態が変化するとコンポーネントが再描画されます。

```typescript
// page.tsx
const [state, setState] = useState(createInitialSpaState);
//      ^^^^^   ^^^^^^^^
//      現在値  更新関数
```

* `state`：現在の状態（フィルター条件・検索結果・ローディング状態 等）
* `setState`：状態を更新する関数。呼ぶと再描画が走る
* `createInitialSpaState`：初期値を返す関数（`client-state.ts` で定義）

※PHPには相当するものはありません。フォーム→ページ再読み込みという流れの代わりに、JSのメモリ上で状態を保持するのがSPAの特徴です。

## ５．useEffect とデバウンス（自動検索）

`useEffect` は、状態が変化したタイミングで処理を実行するReactのフックです。
このSPAでは、フィルター条件が変わるたびにDBを自動検索しています。

```typescript
const DEBOUNCE_MS = 250; // 250ミリ秒待ってから検索

useEffect(() => {
  const timeoutId = setTimeout(() => {
    // フィルター変化から250ms後に検索を実行
    void searchPdbAction(filters).then(result => {
      setState(...);
    });
  }, DEBOUNCE_MS);

  return () => clearTimeout(timeoutId); // 新しい変化が来たらタイマーをキャンセル
}, [state.filters]); // ← state.filtersが変化したときだけ実行
```

**デバウンス**とは、連続した変化の最後から一定時間後だけ処理を実行する技法です。
「1文字入力するたびに検索」では過剰なリクエストが発生するため、250ms待ってから検索しています。

## ６．データの流れ（まとめ）

```
[ユーザーが入力欄を変更]
  ↓ onChange イベント → handleFiltersChange()
[state.filters が更新] → コンポーネント再描画
  ↓ useEffect が検知（250ms後）
[searchPdbAction を呼び出し]  ← ここからサーバー側
  ↓ DBを検索して結果を返す
[setState で state.results を更新] → テーブルが再描画
```

## ７．コンポーネント間のデータ受け渡し（Props）

`page.tsx` が状態を一元管理し、子コンポーネントに **props**（プロパティ）として渡しています。

```tsx
// page.tsx → SearchForm に渡す
<SearchForm
  filters={state.filters}       // 現在のフィルター値（表示用）
  onChange={handleFiltersChange} // 変化を通知するコールバック
/>

// SearchForm 側で受け取る
function SearchForm({ filters, onChange }) {
  <input value={filters.id} onChange={(e) => onChange({...filters, id: e.target.value})} />
}
```

* データは親から子へ **props** として流れる（一方向）
* 子から親へのイベント通知はコールバック関数（`onChange` 等）を使う

---

## ８．[src/lib/pdb.ts](../../../../my-app/src/lib/pdb.ts) の SQL（actions.ts から呼ばれる処理）

`actions.ts` の Server Action は `@/lib/pdb.ts` の関数を呼び出してDBを検索します。
その実際のSQL処理を確認します。

**searchPdbAction → fetchPdbSearchResults（一覧検索）**

```typescript
// actions.ts
export async function searchPdbAction(raw) {
  const filters = normalizeSearchFilters(raw);
  const rows = await fetchPdbSearchResults(filters);
  return { ok: true, rows };
}

// @/lib/pdb.ts の中身
export async function fetchPdbSearchResults(filters) {
  const result = await db.execute(sql`
    select pdb.pdbid, pdb.method, pdb.resolution, pdb.class,
           protein.name, protein.organism
    from pdb
    inner join pdb2protein on pdb.pdbid = pdb2protein.pdbid
    inner join protein on pdb2protein.proteinid = protein.proteinid
    where (pdb.pdbid like '%' || ${filters.id} || '%')
      and (protein.name like '%' || ${filters.name} || '%')
      and (protein.organism like '%' || ${filters.organism} || '%')
      ${filters.resolution === null
        ? sql``
        : sql`and (pdb.resolution <= ${filters.resolution})`}
  `);
  return result.rows;
}
```

* `like '%' || ${...} || '%'`：部分一致検索。`${...}` で変数をSQLに安全に埋め込む（SQLインジェクション対策済み）
* 空文字 → `like '%%'` → すべてにマッチ（条件なし＝全件）
* `filters.resolution === null` のとき → resolution の WHERE句を追加しない
* `normalizeSearchFilters` がフォーム入力の文字列を型変換・バリデーションする（数値変換、空白除去）

**getPdbDetailAction → fetchPdbDetail（詳細取得）**

PDBIDをクリックすると Server Action が呼ばれ、詳細データを1件取得します。

```typescript
// actions.ts
export async function getPdbDetailAction(pdbid) {
  const detail = await fetchPdbDetail(pdbid);
  if (!detail) return { ok: false, message: "PDB entry not found" };
  return { ok: true, detail };
}

// @/lib/pdb.ts の中身
export async function fetchPdbDetail(pdbid) {
  const result = await db.execute(sql`
    select pdb.pdbid, pdb.method, pdb.resolution, pdb.chain,
           pdb.positions, to_char(pdb.deposited, 'YYYY-MM-DD') as deposited,
           pdb.class, pdb.url, protein.name, protein.organism, protein.len
    from pdb
    inner join pdb2protein on pdb.pdbid = pdb2protein.pdbid
    inner join protein on pdb2protein.proteinid = protein.proteinid
    where pdb.pdbid = ${pdbid}
  `);
  return result.rows[0] ?? null;
}
```

* `where pdb.pdbid = ${pdbid}`：完全一致（`=`）で1件を特定
* `to_char(pdb.deposited, 'YYYY-MM-DD')`：PostgreSQLの日付型を文字列に変換
* `result.rows[0] ?? null`：先頭1件のみ取得。存在しない場合は `null`

※Server ActionはサーバーでSQLを実行し、結果のオブジェクトだけをブラウザに返します。DBの接続情報はブラウザには渡りません。

※このSPA実装はかなり本格的です。演習での自作は必須ではありません。Server Component版（例題）の仕組みをしっかり理解した上で、余裕があれば参考にしてください。
