# 演習4 補足1 (Next.js版): TypeScript基礎

> **対象環境:** Docker Compose (PostgreSQL 17 + PHP/Apache + Next.js 15)
> リポジトリをクローンして `docker compose up` で起動できます。

JavaScriptは、もともとWebブラウザ上で動作するスクリプト言語です。Next.jsでは、JavaScriptを拡張した**TypeScript**を使います。TypeScriptはJavaScriptに「型」の概念を加えた言語で、コード補完やエラー検出が強化されています。

---

## １．変数

JavaScriptでは変数を `let` または `const` で宣言します。
PHPの `$変数名 = 値;` に相当します。

**`const`**（定数：宣言後に値を変更しない場合）

```typescript
const message = "Hello World!";
```

**`let`**（変数：宣言後に値を変更する場合）

```typescript
let count = 0;
count = count + 1;  // 再代入OK
```

※Next.jsのコードでは、基本的に `const` を使います。PHPのように `$` 記号は不要です。

## ２．基本的な型

JavaScriptの主な型は以下の通りです。

* **文字列（string）**： `"Hello"` または `'Hello'`
* **数値（number）**： `42`、`3.14`
* **真偽値（boolean）**： `true`、`false`
* **配列（Array）**： `["ABC", "DEF", "GHI"]`

TypeScriptでは、変数に型を明示することができます（省略しても動作します）。

```typescript
const name: string = "Protein A";
const count: number = 42;
const items: string[] = ["ABC", "DEF", "GHI"];
```

※型注釈（`: string` など）はTypeScript特有の書き方です。PHPには相当する構文はありません。

## ３．テンプレートリテラル

文字列の中に変数を埋め込む場合、バッククォート（`` ` ``）を使った**テンプレートリテラル**が便利です。
PHPの `"文字列 {$変数}"` に相当します。

```typescript
const name = "Protein A";
const msg = `タンパク質名: ${name}`;  // → "タンパク質名: Protein A"
```

## ４．アロー関数

JavaScriptの関数は `function` キーワードでも書けますが、Next.jsでは主に**アロー関数**を使います。
PHPの `function 関数名($引数) { ... }` に相当します。

```typescript
// 引数なし、戻り値なし
const greet = () => {
  console.log("Hello!");
};

// 引数あり、戻り値あり
const double = (n: number): number => {
  return n * 2;
};
```

※ `console.log()` はPHPの `echo` に相当しますが、ブラウザの開発者ツールのコンソールに出力されます。

## ５．非同期処理（async/await）

Next.jsのサーバーサイドコードでは、データベースへのアクセスなど「時間のかかる処理」に `async`/`await` を使います。
`async` をつけた関数の中でのみ、`await` が使えます。

```typescript
async function fetchData() {
  const result = await db.execute(sql`SELECT * FROM protein`);
  return result.rows;
}
```

※PHPでは同様の処理を同期的に書きますが、JavaScriptは非同期処理が標準です。Next.jsの演習ではコードをコピーして使えば問題ありません。
