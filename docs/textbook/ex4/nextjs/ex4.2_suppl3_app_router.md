# 演習4 補足3 (Next.js版): App Router

> **対象環境:** Docker Compose (PostgreSQL 17 + PHP/Apache + Next.js 15)
> リポジトリをクローンして `docker compose up` で起動できます。

Next.jsの**App Router**では、ファイルの配置場所がそのままURLになります。このルールを理解することで、新しいページの作り方がわかります。

---

## １．フォルダ構成とURL

`my-app/src/app/` フォルダの中に置いたフォルダ名がURLのパスになります。
各フォルダの中に `page.tsx` を置くと、そのURLにアクセスしたときに表示されるページになります。

```
my-app/
└─ src/
   └─ app/
      ├─ page.tsx                 → http://localhost:3000/
      ├─ layout.tsx              → 全ページ共通のレイアウト
      ├─ search-pdb-simple/
      │  └─ page.tsx            → http://localhost:3000/search-pdb-simple
      └─ example/
         └─ page.tsx            → http://localhost:3000/example
```

※PHPでは `html/` フォルダにファイルを置きましたが、Next.jsでは `my-app/src/app/` フォルダ以下にページを作ります。

## ２．page.tsx と layout.tsx の役割

* **[`page.tsx`](/my-app/src/app/search-pdb-simple/page.tsx)**：そのURLにアクセスしたときに表示されるページのコンポーネント。必ず `export default function` を含む。
* **layout.tsx**：複数のページで共通するレイアウト（ヘッダー、フッターなど）を定義する。すべてのページに自動的に適用される。

## ３．Server ComponentとClient Componentの違い

Next.jsのコンポーネントには2種類あります。

**Server Component（サーバーコンポーネント）**

* ファイルの先頭に何も書かない（デフォルト）
* サーバー側で実行される。データベースに直接アクセスできる
* `async function` が使える
* ユーザー操作（ボタンクリック等）には対応しない

**Client Component（クライアントコンポーネント）**

* ファイルの先頭に `"use client";` と書く
* ブラウザ側で実行される。ボタンクリックや入力操作が使える
* データベースに直接アクセスできない

※演習の基本課題ではServer Componentを使います。データベースを検索してHTMLを返す用途に適しています。

## ４．export const dynamic = "force-dynamic"

Server Componentでデータベースの最新データを毎回取得するには、ファイルの先頭に以下を記述します。

```typescript
export const dynamic = "force-dynamic";
```

これを書かないと、Next.jsがページをキャッシュし、データベースの内容が更新されても古い結果が表示される場合があります。
データベースを参照するページには必ず記述してください。

## ５．新しいページの作り方

新しいページを追加する手順は次の通りです。

1. `my-app/src/app/` 以下に新しいフォルダを作成する（フォルダ名 = URLパス）
2. そのフォルダの中に `page.tsx` を作成する
3. `export default function` でコンポーネントを定義し、JSXを返す

```tsx
// my-app/src/app/my-page/page.tsx

export default function MyPage() {
  return (
    <main>
      <h1>My New Page</h1>
    </main>
  );
}
```

ファイルを保存すると、`http://localhost:3000/my-page` でアクセスできるようになります。
※Next.js開発サーバー（`docker compose up` で起動）が動いていれば、ファイルを保存するだけで自動的にページが有効になります。
