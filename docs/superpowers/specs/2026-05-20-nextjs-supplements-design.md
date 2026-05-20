# Design: Next.js Supplementary Pages (s1–s5) for ex4

**Date:** 2026-05-20  
**Folder:** `docs/textbook4moodle/nextjs/ex4/`  
**Format:** Moodle HTML fragment (no `<html>/<head>/<body>`, same style as PHP s1–s5)

## Context

PHP補足資料（s1〜s5）と対応するNext.js版補足資料を5ページ作成する。  
受講生はJS/TSほぼゼロ（C言語かPythonの経験程度）。コードはコピペして動かすことが主目的。TypeScriptの型は言及程度でよい。

---

## Page Descriptions

### s1: JavaScript/TypeScript 基礎

**対応PHP:** s1（変数）、s2（型）を合わせたもの相当

**内容:**
- `let` / `const` の違いと使い方（PHPの `$変数名` との比較）
- 基本的な型: `string`, `number`, `boolean`, 配列
- アロー関数 `const f = () => { ... }` の書き方
- テンプレートリテラル `` `${変数}` ``
- TypeScriptの型注釈（`: string` など）は「こういうものがある」と言及程度
- コード例: 変数宣言と簡単な関数

**ターゲット:** JSを初めて見る受講生がNext.jsコードを読めるようになること

---

### s2: JSX と Reactコンポーネントの基礎

**対応PHP:** （PHP s2型に相当するが内容は独自）

**内容:**
- JSXとは何か（HTMLに見えるJavaScriptの記法）
- 関数コンポーネントの書き方: `export default function MyPage() { return <main>...</main>; }`
- PHPとの違い（`class` → `className`、タグは必ず閉じる等）
- JSX内での式の埋め込み: `{変数名}`, `{配列.map(...)}`, `{条件 && <要素>}`
- `<Link href="...">` の使い方（`next/link`）
- コード例: シンプルな関数コンポーネント

---

### s3: Next.js App Router のファイル構成

**対応PHP:** （PHP s4 Hello Worldのファイル置き場説明に相当）

**内容:**
- `my-app/src/app/` フォルダとURLの対応（フォルダ名 = URLパス）
- `page.tsx` の役割（ページ本体）、`layout.tsx` の役割（共通レイアウト）
- Server Component（`async function`）と Client Component（`"use client"`）の違いと使い分け
- `export const dynamic = "force-dynamic"` の意味（毎回DBから取得するため）
- 新しいページを作るときの手順: フォルダを作って `page.tsx` を置く
- ファイル構成の全体図（テキスト形式）

---

### s4: DB接続とSQL実行（Drizzle ORM）

**対応PHP:** s3（PDO DB接続）

**内容:**
- `.env` ファイルの設定（`DATABASE_URL` の書き方、`.env.example` からのコピー方法）
- `src/lib/db.ts` の仕組み（Drizzleインスタンスを取得する関数）
- `db.execute(sql`SELECT ...`)` のパターンと戻り値（`result.rows`）
- 型定義 `type MyRow = { ... }` で結果の型を指定する方法（コピペ用）
- PHPのPDO/`pg_query` との比較（概念的対応）
- コード例: シンプルなSELECT文の実行から結果取得まで

---

### s5: サンプルプログラム解説 — `search-pdb-simple/page.tsx`

**対応PHP:** s4（Hello Worldサンプル）+ s5（配列・ループ）合わせたもの

**内容:**
- `my-app/src/app/search-pdb-simple/page.tsx` 全コードを表示
- 各ブロックを番号付きで解説:
  1. import 文（`sql`, `db` を読み込む）
  2. `export const dynamic = "force-dynamic"`
  3. 型定義 `type SimplePdbRow = { ... }`
  4. `async function fetchRows()` — DB検索関数
  5. `export default async function SearchPdbSimplePage()` — ページコンポーネント
  6. JSXのテーブル表示部分
  7. `rows.map((row, index) => ...)` — 配列のループ表示
- アクセス方法: `http://localhost:3000/search-pdb-simple`

---

## HTML Format Rules

PHPのs1〜s5と同じMoodle HTMLフラグメントスタイルを使用:

- `<h5>` でセクションヘッダ
- コードブロック: `<p style="padding: 10px 15px; background: #1f1f1f; color: #fafafa">`
- `<code>` タグでインラインコード
- 警告（赤）: `<span style="color: #ff0000">`
- 情報（青）: `<span style="color: #0000ff">`
- ファイル名: `docs/textbook4moodle/nextjs/ex4/s1.html` 〜 `s5.html`

## Deliverables

| ファイル | タイトル |
|--------|---------|
| `docs/textbook4moodle/nextjs/ex4/s1.html` | JavaScript/TypeScript 基礎 |
| `docs/textbook4moodle/nextjs/ex4/s2.html` | JSX と Reactコンポーネントの基礎 |
| `docs/textbook4moodle/nextjs/ex4/s3.html` | App Router のファイル構成 |
| `docs/textbook4moodle/nextjs/ex4/s4.html` | DB接続とSQL実行 |
| `docs/textbook4moodle/nextjs/ex4/s5.html` | サンプルプログラム解説 |
