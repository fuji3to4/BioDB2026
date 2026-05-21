# 演習4 補足2 (Next.js版): JSX・React基礎

> **対象環境:** Docker Compose (PostgreSQL 17 + PHP/Apache + Next.js 15)
> リポジトリをクローンして `docker compose up` で起動できます。

ReactはJavaScriptのUIライブラリです。Next.jsはReactをベースとしたWebフレームワークで、**JSX**という記法を使ってUIを記述します。

---

## １．JSXとは

JSXは、JavaScriptの中にHTMLのような記法を書くための構文です。
Next.jsのコードでは、関数の戻り値としてJSXを返すことでHTMLを出力します。

```tsx
// JSXの例
return (
  <main>
    <h1>Hello World!</h1>
  </main>
);
```

JSXはブラウザに送られる前にJavaScriptのコードに変換されます。PHPと異なり、JavaScriptの中に直接HTMLを書きます。

## ２．関数コンポーネント

Next.jsのページは**関数コンポーネント**として定義します。
関数が返す（`return`する）JSXが、ブラウザに表示されるHTMLになります。

```tsx
export default function MyPage() {
  return (
    <main>
      <h1>My Page</h1>
      <p>Hello!</p>
    </main>
  );
}
```

`export default` はこのファイルのメインの関数として外部に公開することを意味します。Next.jsはこれを自動的にページとして認識します。

## ３．PHPとJSXの主な違い

JSXを書く際、HTMLとは異なる点があります。

* `class` 属性は `className` と書く
* タグは必ず閉じる（例：`<br />`、`<input />`）
* 属性値は文字列なら `"..."`、JavaScript式なら `{...}` で囲む
* コメントは `{/* ... */}` で書く

```tsx
{/* PHPの class="card" → JSXでは className="card" */}
<div className="card">..</div>

{/* 属性にJavaScript式を使う */}
<p style={{ color: "red" }}>エラー</p>
```

## ４．JSX内での式の埋め込み

JSXの中で変数や計算結果を表示するには `{}` で囲みます。
PHPの `<?php echo $変数; ?>` に相当します。

```tsx
const count = 42;

return (
  <p>{count} 件のデータがあります</p>
);
```

配列の各要素を表示するには `.map()` を使います（PHPの `foreach` に相当）。

```tsx
const items = ["ABC", "DEF", "GHI"];

return (
  <ul>
    {items.map((item, index) => (
      <li key={index}>{item}</li>
    ))}
  </ul>
);
```

※ `key` 属性はReactがリストを効率的に更新するために必要です。通常はユニークなIDや配列のインデックスを使います。

## ５．Link コンポーネント

Next.jsでページ間のリンクを作るには、`<a>` タグの代わりに `<Link>` コンポーネントを使います。

```tsx
import Link from "next/link";

<Link href="/search-pdb-simple">検索ページへ</Link>
```
