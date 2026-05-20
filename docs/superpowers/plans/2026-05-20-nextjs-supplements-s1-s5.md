# Next.js Supplementary Pages (s1–s5) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Create 5 Moodle HTML fragment files (`s1.html`–`s5.html`) in `docs/textbook4moodle/nextjs/ex4/` as Next.js supplementary references equivalent to the PHP s1–s5 pages.

**Architecture:** Each file is a self-contained Moodle HTML fragment (no `<html>/<head>/<body>` tags) using the same dark-code-block style as the PHP supplement pages. Content is written in Japanese, targeted at beginners (C/Python background, no JS experience).

**Tech Stack:** HTML fragments for Moodle LMS; references Next.js 15 App Router, TypeScript, Drizzle ORM, PostgreSQL via Docker Compose.

---

## File Map

| File | Content |
|------|---------|
| `docs/textbook4moodle/nextjs/ex4/s1.html` | JavaScript/TypeScript 基礎（変数・型・関数・async/await） |
| `docs/textbook4moodle/nextjs/ex4/s2.html` | JSX と Reactコンポーネントの基礎 |
| `docs/textbook4moodle/nextjs/ex4/s3.html` | App Router のファイル構成とルーティング |
| `docs/textbook4moodle/nextjs/ex4/s4.html` | DB接続とSQL実行（Drizzle ORM） |
| `docs/textbook4moodle/nextjs/ex4/s5.html` | サンプルプログラム解説（search-pdb-simple/page.tsx） |

## HTML Format Rules (apply to all files)

- No `<html>/<head>/<body>` tags
- Code blocks: `<p style="padding: 10px 15px; background: #1f1f1f; color: #fafafa">`
- Inside code blocks: HTML special chars escaped (`<` → `&lt;`, `>` → `&gt;`), spaces → `&nbsp;`, line breaks → `<br>`
- Section headers: `<h5>`
- Inline code: `<code>`
- Info (blue): `<span style="color: #0000ff">`
- Warning (red): `<span style="color: #ff0000">`
- Separator: `<hr />`
- Blank line spacer: `<p>&nbsp;</p>`

---

## Task 1: Create s1.html — JavaScript/TypeScript 基礎

**Files:**
- Create: `docs/textbook4moodle/nextjs/ex4/s1.html`

- [ ] **Step 1: Create the file**

Create `docs/textbook4moodle/nextjs/ex4/s1.html` with the following content:

```html
<p>JavaScriptは、もともとWebブラウザ上で動作するスクリプト言語です。Next.jsでは、JavaScriptを拡張した<strong>TypeScript</strong>を使います。TypeScriptはJavaScriptに「型」の概念を加えた言語で、コード補完やエラー検出が強化されています。</p>
<hr />

<h5>１．変数</h5>
<p>
  JavaScriptでは変数を <code>let</code> または <code>const</code> で宣言します。<br>
  PHPの <code>$変数名 = 値;</code> に相当します。
</p>
<p><strong><code>const</code></strong>（定数：宣言後に値を変更しない場合）</p>
<p style="padding: 10px 15px; background: #1f1f1f; color: #fafafa">
  const message = "Hello World!";
</p>
<p><strong><code>let</code></strong>（変数：宣言後に値を変更する場合）</p>
<p style="padding: 10px 15px; background: #1f1f1f; color: #fafafa">
  let count = 0;<br>
  count = count + 1;&nbsp;&nbsp;// 再代入OK
</p>
<p>
  <span style="color: #0000ff">※Next.jsのコードでは、基本的に <code>const</code> を使います。PHPのように <code>$</code> 記号は不要です。</span>
</p>
<p>&nbsp;</p>

<h5>２．基本的な型</h5>
<p>JavaScriptの主な型は以下の通りです。</p>
<ul>
  <li><strong>文字列（string）</strong>： <code>"Hello"</code> または <code>'Hello'</code></li>
  <li><strong>数値（number）</strong>： <code>42</code>、<code>3.14</code></li>
  <li><strong>真偽値（boolean）</strong>： <code>true</code>、<code>false</code></li>
  <li><strong>配列（Array）</strong>： <code>["ABC", "DEF", "GHI"]</code></li>
</ul>
<p>TypeScriptでは、変数に型を明示することができます（省略しても動作します）。</p>
<p style="padding: 10px 15px; background: #1f1f1f; color: #fafafa">
  const name: string = "Protein A";<br>
  const count: number = 42;<br>
  const items: string[] = ["ABC", "DEF", "GHI"];
</p>
<p>
  <span style="color: #0000ff">※型注釈（<code>: string</code> など）はTypeScript特有の書き方です。PHPには相当する構文はありません。</span>
</p>
<p>&nbsp;</p>

<h5>３．テンプレートリテラル</h5>
<p>
  文字列の中に変数を埋め込む場合、バッククォート（<code>`</code>）を使った<strong>テンプレートリテラル</strong>が便利です。<br>
  PHPの <code>"文字列 {$変数}"</code> に相当します。
</p>
<p style="padding: 10px 15px; background: #1f1f1f; color: #fafafa">
  const name = "Protein A";<br>
  const msg = `タンパク質名: ${name}`;&nbsp;&nbsp;// → "タンパク質名: Protein A"
</p>
<p>&nbsp;</p>

<h5>４．アロー関数</h5>
<p>
  JavaScriptの関数は <code>function</code> キーワードでも書けますが、Next.jsでは主に<strong>アロー関数</strong>を使います。<br>
  PHPの <code>function 関数名($引数) { ... }</code> に相当します。
</p>
<p style="padding: 10px 15px; background: #1f1f1f; color: #fafafa">
  // 引数なし、戻り値なし<br>
  const greet = () =&gt; {<br>
  &nbsp;&nbsp;console.log("Hello!");<br>
  };<br>
  <br>
  // 引数あり、戻り値あり<br>
  const double = (n: number): number =&gt; {<br>
  &nbsp;&nbsp;return n * 2;<br>
  };
</p>
<p>
  <span style="color: #0000ff">※ <code>console.log()</code> はPHPの <code>echo</code> に相当しますが、ブラウザの開発者ツールのコンソールに出力されます。</span>
</p>
<p>&nbsp;</p>

<h5>５．非同期処理（async/await）</h5>
<p>
  Next.jsのサーバーサイドコードでは、データベースへのアクセスなど「時間のかかる処理」に <code>async</code>/<code>await</code> を使います。<br>
  <code>async</code> をつけた関数の中でのみ、<code>await</code> が使えます。
</p>
<p style="padding: 10px 15px; background: #1f1f1f; color: #fafafa">
  async function fetchData() {<br>
  &nbsp;&nbsp;const result = await db.execute(sql`SELECT * FROM protein`);<br>
  &nbsp;&nbsp;return result.rows;<br>
  }
</p>
<p>
  <span style="color: #0000ff">※PHPでは同様の処理を同期的に書きますが、JavaScriptは非同期処理が標準です。Next.jsの演習ではコードをコピーして使えば問題ありません。</span>
</p>
<p>&nbsp;</p>
```

- [ ] **Step 2: Verify file exists and has correct format**

```powershell
Get-Content docs/textbook4moodle/nextjs/ex4/s1.html | Select-Object -First 3
```
Expected: first line is `<p>JavaScriptは、...`

---

## Task 2: Create s2.html — JSX と Reactコンポーネントの基礎

**Files:**
- Create: `docs/textbook4moodle/nextjs/ex4/s2.html`

- [ ] **Step 1: Create the file**

Create `docs/textbook4moodle/nextjs/ex4/s2.html` with the following content:

```html
<p>ReactはJavaScriptのUIライブラリです。Next.jsはReactをベースとしたWebフレームワークで、<strong>JSX</strong>という記法を使ってUIを記述します。</p>
<hr />

<h5>１．JSXとは</h5>
<p>
  JSXは、JavaScriptの中にHTMLのような記法を書くための構文です。<br>
  Next.jsのコードでは、関数の戻り値としてJSXを返すことでHTMLを出力します。
</p>
<p style="padding: 10px 15px; background: #1f1f1f; color: #fafafa">
  // JSXの例<br>
  return (<br>
  &nbsp;&nbsp;&lt;main&gt;<br>
  &nbsp;&nbsp;&nbsp;&nbsp;&lt;h1&gt;Hello World!&lt;/h1&gt;<br>
  &nbsp;&nbsp;&lt;/main&gt;<br>
  );
</p>
<p>
  JSXはブラウザに送られる前にJavaScriptのコードに変換されます。PHPと異なり、JavaScriptの中に直接HTMLを書きます。
</p>
<p>&nbsp;</p>

<h5>２．関数コンポーネント</h5>
<p>
  Next.jsのページは<strong>関数コンポーネント</strong>として定義します。<br>
  関数が返す（<code>return</code>する）JSXが、ブラウザに表示されるHTMLになります。
</p>
<p style="padding: 10px 15px; background: #1f1f1f; color: #fafafa">
  export default function MyPage() {<br>
  &nbsp;&nbsp;return (<br>
  &nbsp;&nbsp;&nbsp;&nbsp;&lt;main&gt;<br>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&lt;h1&gt;My Page&lt;/h1&gt;<br>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&lt;p&gt;Hello!&lt;/p&gt;<br>
  &nbsp;&nbsp;&nbsp;&nbsp;&lt;/main&gt;<br>
  &nbsp;&nbsp;);<br>
  }
</p>
<p>
  <code>export default</code> はこのファイルのメインの関数として外部に公開することを意味します。Next.jsはこれを自動的にページとして認識します。
</p>
<p>&nbsp;</p>

<h5>３．PHPとJSXの主な違い</h5>
<p>JSXを書く際、HTMLとは異なる点があります。</p>
<ul>
  <li><code>class</code> 属性は <code>className</code> と書く</li>
  <li>タグは必ず閉じる（例：<code>&lt;br /&gt;</code>、<code>&lt;input /&gt;</code>）</li>
  <li>属性値は文字列なら <code>"..."</code>、JavaScript式なら <code>{...}</code> で囲む</li>
  <li>コメントは <code>{/* ... */}</code> で書く</li>
</ul>
<p style="padding: 10px 15px; background: #1f1f1f; color: #fafafa">
  {/* PHPの class="card" → JSXでは className="card" */}<br>
  &lt;div className="card"&gt;..&lt;/div&gt;<br>
  <br>
  {/* 属性にJavaScript式を使う */}<br>
  &lt;p style={{ color: "red" }}&gt;エラー&lt;/p&gt;
</p>
<p>&nbsp;</p>

<h5>４．JSX内での式の埋め込み</h5>
<p>
  JSXの中で変数や計算結果を表示するには <code>{}</code> で囲みます。<br>
  PHPの <code>&lt;?php echo $変数; ?&gt;</code> に相当します。
</p>
<p style="padding: 10px 15px; background: #1f1f1f; color: #fafafa">
  const count = 42;<br>
  <br>
  return (<br>
  &nbsp;&nbsp;&lt;p&gt;{count} 件のデータがあります&lt;/p&gt;<br>
  );
</p>
<p>配列の各要素を表示するには <code>.map()</code> を使います（PHPの <code>foreach</code> に相当）。</p>
<p style="padding: 10px 15px; background: #1f1f1f; color: #fafafa">
  const items = ["ABC", "DEF", "GHI"];<br>
  <br>
  return (<br>
  &nbsp;&nbsp;&lt;ul&gt;<br>
  &nbsp;&nbsp;&nbsp;&nbsp;{items.map((item, index) =&gt; (<br>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&lt;li key={index}&gt;{item}&lt;/li&gt;<br>
  &nbsp;&nbsp;&nbsp;&nbsp;))}<br>
  &nbsp;&nbsp;&lt;/ul&gt;<br>
  );
</p>
<p>
  <span style="color: #0000ff">※ <code>key</code> 属性はReactがリストを効率的に更新するために必要です。通常はユニークなIDや配列のインデックスを使います。</span>
</p>
<p>&nbsp;</p>

<h5>５．Link コンポーネント</h5>
<p>
  Next.jsでページ間のリンクを作るには、<code>&lt;a&gt;</code> タグの代わりに <code>&lt;Link&gt;</code> コンポーネントを使います。
</p>
<p style="padding: 10px 15px; background: #1f1f1f; color: #fafafa">
  import Link from "next/link";<br>
  <br>
  &lt;Link href="/search-pdb-simple"&gt;検索ページへ&lt;/Link&gt;
</p>
<p>&nbsp;</p>
```

- [ ] **Step 2: Verify file exists**

```powershell
Get-Content docs/textbook4moodle/nextjs/ex4/s2.html | Select-Object -First 3
```
Expected: first line is `<p>ReactはJavaScriptの...`

---

## Task 3: Create s3.html — App Router のファイル構成

**Files:**
- Create: `docs/textbook4moodle/nextjs/ex4/s3.html`

- [ ] **Step 1: Create the file**

Create `docs/textbook4moodle/nextjs/ex4/s3.html` with the following content:

```html
<p>Next.jsの<strong>App Router</strong>では、ファイルの配置場所がそのままURLになります。このルールを理解することで、新しいページの作り方がわかります。</p>
<hr />

<h5>１．フォルダ構成とURL</h5>
<p>
  <code>my-app/src/app/</code> フォルダの中に置いたフォルダ名がURLのパスになります。<br>
  各フォルダの中に <code>page.tsx</code> を置くと、そのURLにアクセスしたときに表示されるページになります。
</p>
<p style="padding: 10px 15px; background: #1f1f1f; color: #fafafa">
  my-app/<br>
  └─ src/<br>
  &nbsp;&nbsp;&nbsp;└─ app/<br>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;├─ page.tsx&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;→ http://localhost:3000/<br>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;├─ layout.tsx&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;→ 全ページ共通のレイアウト<br>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;├─ search-pdb-simple/<br>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;│&nbsp;&nbsp;└─ page.tsx&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;→ http://localhost:3000/search-pdb-simple<br>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;└─ example/<br>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;└─ page.tsx&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;→ http://localhost:3000/example
</p>
<p>
  <span style="color: #0000ff">※PHPでは <code>html/</code> フォルダにファイルを置きましたが、Next.jsでは <code>my-app/src/app/</code> フォルダ以下にページを作ります。</span>
</p>
<p>&nbsp;</p>

<h5>２．page.tsx と layout.tsx の役割</h5>
<ul>
  <li><strong>page.tsx</strong>：そのURLにアクセスしたときに表示されるページのコンポーネント。必ず <code>export default function</code> を含む。</li>
  <li><strong>layout.tsx</strong>：複数のページで共通するレイアウト（ヘッダー、フッターなど）を定義する。すべてのページに自動的に適用される。</li>
</ul>
<p>&nbsp;</p>

<h5>３．Server ComponentとClient Componentの違い</h5>
<p>Next.jsのコンポーネントには2種類あります。</p>
<p><strong>Server Component（サーバーコンポーネント）</strong></p>
<ul>
  <li>ファイルの先頭に何も書かない（デフォルト）</li>
  <li>サーバー側で実行される。データベースに直接アクセスできる</li>
  <li><code>async function</code> が使える</li>
  <li>ユーザー操作（ボタンクリック等）には対応しない</li>
</ul>
<p><strong>Client Component（クライアントコンポーネント）</strong></p>
<ul>
  <li>ファイルの先頭に <code>"use client";</code> と書く</li>
  <li>ブラウザ側で実行される。ボタンクリックや入力操作が使える</li>
  <li>データベースに直接アクセスできない</li>
</ul>
<p>
  <span style="color: #0000ff">※演習の基本課題ではServer Componentを使います。データベースを検索してHTMLを返す用途に適しています。</span>
</p>
<p>&nbsp;</p>

<h5>４．export const dynamic = "force-dynamic"</h5>
<p>
  Server Componentでデータベースの最新データを毎回取得するには、ファイルの先頭に以下を記述します。
</p>
<p style="padding: 10px 15px; background: #1f1f1f; color: #fafafa">
  export const dynamic = "force-dynamic";
</p>
<p>
  これを書かないと、Next.jsがページをキャッシュし、データベースの内容が更新されても古い結果が表示される場合があります。<br>
  データベースを参照するページには必ず記述してください。
</p>
<p>&nbsp;</p>

<h5>５．新しいページの作り方</h5>
<p>新しいページを追加する手順は次の通りです。</p>
<ol>
  <li><code>my-app/src/app/</code> 以下に新しいフォルダを作成する（フォルダ名 = URLパス）</li>
  <li>そのフォルダの中に <code>page.tsx</code> を作成する</li>
  <li><code>export default function</code> でコンポーネントを定義し、JSXを返す</li>
</ol>
<p style="padding: 10px 15px; background: #1f1f1f; color: #fafafa">
  // my-app/src/app/my-page/page.tsx<br>
  <br>
  export default function MyPage() {<br>
  &nbsp;&nbsp;return (<br>
  &nbsp;&nbsp;&nbsp;&nbsp;&lt;main&gt;<br>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&lt;h1&gt;My New Page&lt;/h1&gt;<br>
  &nbsp;&nbsp;&nbsp;&nbsp;&lt;/main&gt;<br>
  &nbsp;&nbsp;);<br>
  }
</p>
<p>
  ファイルを保存すると、<code>http://localhost:3000/my-page</code> でアクセスできるようになります。<br>
  <span style="color: #0000ff">※Next.js開発サーバー（<code>docker compose up</code> で起動）が動いていれば、ファイルを保存するだけで自動的にページが有効になります。</span>
</p>
<p>&nbsp;</p>
```

- [ ] **Step 2: Verify file exists**

```powershell
Get-Content docs/textbook4moodle/nextjs/ex4/s3.html | Select-Object -First 3
```
Expected: first line is `<p>Next.jsの<strong>App Router</strong>...`

---

## Task 4: Create s4.html — DB接続とSQL実行（Drizzle ORM）

**Files:**
- Create: `docs/textbook4moodle/nextjs/ex4/s4.html`

- [ ] **Step 1: Create the file**

Create `docs/textbook4moodle/nextjs/ex4/s4.html` with the following content:

```html
<h5>データベース接続の設定</h5>

<p><strong>.envファイルの設定</strong></p>
<p>
  Next.jsからPostgreSQLに接続するには、<code>my-app/</code> フォルダに <code>.env</code> ファイルを作成します。<br>
  まず <code>.env.example</code> をコピーして <code>.env</code> を作成します。
</p>
<p style="padding: 10px 15px; background: #1f1f1f; color: #fafafa">
  # my-app/.env<br>
  DATABASE_URL="postgresql://user:password@postgres:5432/demo"
</p>
<ul>
  <li><code>user</code>：DBユーザー名</li>
  <li><code>password</code>：DBパスワード</li>
  <li><code>postgres</code>：ホスト名（Docker ComposeのPostgreSQLサービス名）</li>
  <li><code>5432</code>：ポート番号</li>
  <li><code>demo</code>：データベース名</li>
</ul>
<p>
  <span style="color: #0000ff">※ホスト名は <code>localhost</code> ではなく <code>postgres</code>（Docker Composeのサービス名）を指定します。PHPの設定と同じです。</span>
</p>
<p>&nbsp;</p>

<h5>Drizzle ORM によるDB接続</h5>
<p>
  Next.jsでは<strong>Drizzle ORM</strong>ライブラリを使ってPostgreSQLに接続します。<br>
  接続設定は <code>my-app/src/lib/db.ts</code> に記述されています（変更不要）。
</p>
<p style="padding: 10px 15px; background: #1f1f1f; color: #fafafa">
  // my-app/src/lib/db.ts （参考：変更不要）<br>
  import { drizzle } from "drizzle-orm/node-postgres";<br>
  <br>
  // ...<br>
  <br>
  dbInstance = drizzle(connectionString);&nbsp;&nbsp;// .envのDATABASE_URLを使って接続
</p>
<p>
  <span style="color: #0000ff">※PHPの <code>new PDO($dsn, $user, $pass)</code> に相当します。</span>
</p>
<p>&nbsp;</p>

<hr />

<h5>SQLの実行方法</h5>

<p><strong>（1）必要なものをimport</strong></p>
<p style="padding: 10px 15px; background: #1f1f1f; color: #fafafa">
  import { sql } from "drizzle-orm";<br>
  import { db } from "@/lib/db";
</p>

<p><strong>（2）SQL文の実行</strong></p>
<p style="padding: 10px 15px; background: #1f1f1f; color: #fafafa">
  const result = await db.execute(sql`SELECT * FROM protein`);
</p>
<p>
  <code>sql`...`</code> はテンプレートリテラルを使ったSQLタグです。SQL文をそのまま書けます。<br>
  <span style="color: #0000ff">※PHPの <code>$stmh = $pdo-&gt;prepare($sql); $stmh-&gt;execute();</code> に相当します。</span>
</p>

<p><strong>（3）結果の取得</strong></p>
<p style="padding: 10px 15px; background: #1f1f1f; color: #fafafa">
  const rows = result.rows;&nbsp;&nbsp;// 検索結果の配列
</p>
<p>
  <code>result.rows</code> はオブジェクトの配列です。各要素は列名をキーとして <code>row.pdbid</code> のようにアクセスできます。<br>
  <span style="color: #0000ff">※PHPの <code>$stmh-&gt;fetchAll(PDO::FETCH_ASSOC)</code> に相当します。</span>
</p>

<p><strong>（4）型定義（コピペ用）</strong></p>
<p>TypeScriptでは結果の型を定義しておくと、コード補完が効いて便利です（省略しても動作します）。</p>
<p style="padding: 10px 15px; background: #1f1f1f; color: #fafafa">
  type MyRow = {<br>
  &nbsp;&nbsp;pdbid: string;<br>
  &nbsp;&nbsp;resolution: number | string | null;<br>
  &nbsp;&nbsp;name: string;<br>
  };<br>
  <br>
  const rows = result.rows as MyRow[];
</p>
<p>&nbsp;</p>

<p><strong>まとめ：DB検索の基本パターン</strong></p>
<p style="padding: 10px 15px; background: #1f1f1f; color: #fafafa">
  import { sql } from "drizzle-orm";<br>
  import { db } from "@/lib/db";<br>
  <br>
  export const dynamic = "force-dynamic";<br>
  <br>
  type MyRow = { pdbid: string; name: string; };<br>
  <br>
  async function fetchRows(): Promise&lt;MyRow[]&gt; {<br>
  &nbsp;&nbsp;const result = await db.execute(sql`SELECT pdbid, name FROM protein`);<br>
  &nbsp;&nbsp;return result.rows as MyRow[];<br>
  }<br>
  <br>
  export default async function MyPage() {<br>
  &nbsp;&nbsp;const rows = await fetchRows();<br>
  &nbsp;&nbsp;// rowsを使って表示...<br>
  }
</p>
<p>&nbsp;</p>
```

- [ ] **Step 2: Verify file exists**

```powershell
Get-Content docs/textbook4moodle/nextjs/ex4/s4.html | Select-Object -First 3
```
Expected: first line is `<h5>データベース接続の設定</h5>`

---

## Task 5: Create s5.html — サンプルプログラム解説

**Files:**
- Create: `docs/textbook4moodle/nextjs/ex4/s5.html`

- [ ] **Step 1: Create the file**

Create `docs/textbook4moodle/nextjs/ex4/s5.html` with the following content:

```html
<h5>Next.js サンプルプログラム解説</h5>

<p>
  ここでは <code>my-app/src/app/search-pdb-simple/page.tsx</code> の内容を解説します。<br>
  このプログラムは、データベースからPDB情報を検索して一覧表示するページです。<br>
  ブラウザで <code>http://localhost:3000/search-pdb-simple</code> にアクセスすると動作を確認できます。
</p>
<p>&nbsp;</p>

<p><strong>【プログラム全体】</strong></p>
<p style="padding: 10px 15px; background: #1f1f1f; color: #fafafa">
  import { sql } from "drizzle-orm";<br>
  import { db } from "@/lib/db";<br>
  <br>
  export const dynamic = "force-dynamic";<br>
  <br>
  type SimplePdbRow = {<br>
  &nbsp;&nbsp;pdbid: string;<br>
  &nbsp;&nbsp;resolution: number | string | null;<br>
  &nbsp;&nbsp;name: string;<br>
  &nbsp;&nbsp;organism: string;<br>
  };<br>
  <br>
  async function fetchRows(): Promise&lt;SimplePdbRow[]&gt; {<br>
  &nbsp;&nbsp;const result = await db.execute(sql`<br>
  &nbsp;&nbsp;&nbsp;&nbsp;select pdb.pdbid, pdb.resolution, protein.name, protein.organism<br>
  &nbsp;&nbsp;&nbsp;&nbsp;from pdb<br>
  &nbsp;&nbsp;&nbsp;&nbsp;inner join pdb2protein on pdb.pdbid = pdb2protein.pdbid<br>
  &nbsp;&nbsp;&nbsp;&nbsp;inner join protein on pdb2protein.proteinid = protein.proteinid<br>
  &nbsp;&nbsp;&nbsp;&nbsp;where pdb.resolution &lt;= 2.5<br>
  &nbsp;&nbsp;`);<br>
  &nbsp;&nbsp;return result.rows as SimplePdbRow[];<br>
  }<br>
  <br>
  export default async function SearchPdbSimplePage() {<br>
  &nbsp;&nbsp;const rows = await fetchRows();<br>
  <br>
  &nbsp;&nbsp;return (<br>
  &nbsp;&nbsp;&nbsp;&nbsp;&lt;main className="page-shell"&gt;<br>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&lt;section className="card"&gt;<br>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&lt;h1&gt;Search Result (Simple)&lt;/h1&gt;<br>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&lt;p&gt;{rows.length} result(s)&lt;/p&gt;<br>
  <br>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&lt;table className="data-table"&gt;<br>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&lt;thead&gt;<br>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&lt;tr&gt;<br>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&lt;th&gt;PDBID&lt;/th&gt;<br>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&lt;th&gt;Resolution&lt;/th&gt;<br>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&lt;th&gt;Protein name&lt;/th&gt;<br>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&lt;th&gt;Organism&lt;/th&gt;<br>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&lt;/tr&gt;<br>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&lt;/thead&gt;<br>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&lt;tbody&gt;<br>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{rows.map((row, index) =&gt; (<br>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&lt;tr key={`${row.pdbid}-${row.name}-${index}`}&gt;<br>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&lt;td&gt;{row.pdbid}&lt;/td&gt;<br>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&lt;td&gt;{row.resolution}&lt;/td&gt;<br>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&lt;td&gt;{row.name}&lt;/td&gt;<br>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&lt;td&gt;{row.organism}&lt;/td&gt;<br>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&lt;/tr&gt;<br>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;))}<br>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&lt;/tbody&gt;<br>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&lt;/table&gt;<br>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&lt;/section&gt;<br>
  &nbsp;&nbsp;&nbsp;&nbsp;&lt;/main&gt;<br>
  &nbsp;&nbsp;);<br>
  }
</p>
<p>&nbsp;</p>

<p><strong>【解説】</strong></p>

<p><strong>① import文</strong></p>
<p style="padding: 10px 15px; background: #1f1f1f; color: #fafafa">
  import { sql } from "drizzle-orm";<br>
  import { db } from "@/lib/db";
</p>
<p>
  <code>sql</code>：SQL文を記述するためのタグ関数（<code>sql`SELECT ...`</code> の形で使う）<br>
  <code>db</code>：DBへの接続オブジェクト（<code>src/lib/db.ts</code> で定義）
</p>

<p><strong>② キャッシュ無効化</strong></p>
<p style="padding: 10px 15px; background: #1f1f1f; color: #fafafa">
  export const dynamic = "force-dynamic";
</p>
<p>DBの最新データを毎回取得するための設定です。DBを参照するページには必ず記述します。</p>

<p><strong>③ 型定義</strong></p>
<p style="padding: 10px 15px; background: #1f1f1f; color: #fafafa">
  type SimplePdbRow = {<br>
  &nbsp;&nbsp;pdbid: string;<br>
  &nbsp;&nbsp;resolution: number | string | null;<br>
  &nbsp;&nbsp;name: string;<br>
  &nbsp;&nbsp;organism: string;<br>
  };
</p>
<p>
  DB検索結果1行分のデータの型を定義します。列名と型を合わせて書きます。<br>
  <code>number | string | null</code> は「数値・文字列・nullのいずれか」という意味です。
</p>

<p><strong>④ DB検索関数</strong></p>
<p style="padding: 10px 15px; background: #1f1f1f; color: #fafafa">
  async function fetchRows(): Promise&lt;SimplePdbRow[]&gt; {<br>
  &nbsp;&nbsp;const result = await db.execute(sql`<br>
  &nbsp;&nbsp;&nbsp;&nbsp;select pdb.pdbid, pdb.resolution, protein.name, protein.organism<br>
  &nbsp;&nbsp;&nbsp;&nbsp;from pdb<br>
  &nbsp;&nbsp;&nbsp;&nbsp;inner join pdb2protein on pdb.pdbid = pdb2protein.pdbid<br>
  &nbsp;&nbsp;&nbsp;&nbsp;inner join protein on pdb2protein.proteinid = protein.proteinid<br>
  &nbsp;&nbsp;&nbsp;&nbsp;where pdb.resolution &lt;= 2.5<br>
  &nbsp;&nbsp;`);<br>
  &nbsp;&nbsp;return result.rows as SimplePdbRow[];<br>
  }
</p>
<p>
  <code>async function</code>：非同期関数（DB処理には必須）<br>
  <code>db.execute(sql`...`)</code>：SQLを実行する（PHPの <code>$stmh-&gt;execute()</code> に相当）<br>
  <code>result.rows</code>：検索結果の配列（PHPの <code>fetchAll()</code> に相当）<br>
  <code>as SimplePdbRow[]</code>：結果を <code>SimplePdbRow</code> 型の配列として扱う指定
</p>

<p><strong>⑤ ページコンポーネント</strong></p>
<p style="padding: 10px 15px; background: #1f1f1f; color: #fafafa">
  export default async function SearchPdbSimplePage() {<br>
  &nbsp;&nbsp;const rows = await fetchRows();<br>
  &nbsp;&nbsp;// ...<br>
  }
</p>
<p>
  <code>export default</code>：このファイルのメインコンポーネントとして公開<br>
  <code>async</code>：DB処理を待つために必要<br>
  <code>await fetchRows()</code>：DB検索関数を呼び出し、結果を <code>rows</code> に格納
</p>

<p><strong>⑥ テーブル表示と .map() によるループ</strong></p>
<p style="padding: 10px 15px; background: #1f1f1f; color: #fafafa">
  {rows.map((row, index) =&gt; (<br>
  &nbsp;&nbsp;&lt;tr key={`${row.pdbid}-${row.name}-${index}`}&gt;<br>
  &nbsp;&nbsp;&nbsp;&nbsp;&lt;td&gt;{row.pdbid}&lt;/td&gt;<br>
  &nbsp;&nbsp;&nbsp;&nbsp;&lt;td&gt;{row.resolution}&lt;/td&gt;<br>
  &nbsp;&nbsp;&nbsp;&nbsp;&lt;td&gt;{row.name}&lt;/td&gt;<br>
  &nbsp;&nbsp;&nbsp;&nbsp;&lt;td&gt;{row.organism}&lt;/td&gt;<br>
  &nbsp;&nbsp;&lt;/tr&gt;<br>
  ))}
</p>
<p>
  <code>rows.map((row, index) =&gt; ...)</code>：配列の各要素に対して処理を行い、新しい配列を返します。PHPの <code>foreach ($result as $row)</code> に相当します。<br>
  <code>key</code>属性：Reactがリストを効率的に管理するために必要な一意の識別子です。<br>
  <code>{row.pdbid}</code>：1行分のデータオブジェクトから列名でアクセスします（PHPの <code>$row["pdbid"]</code> に相当）。
</p>
<p>&nbsp;</p>
```

- [ ] **Step 2: Verify file exists**

```powershell
Get-Content docs/textbook4moodle/nextjs/ex4/s5.html | Select-Object -First 3
```
Expected: first line is `<h5>Next.js サンプルプログラム解説</h5>`

---

## Task 6: Commit all files

- [ ] **Step 1: Stage and commit**

```bash
cd e:\Data\App\BioDB2026
git add docs/textbook4moodle/nextjs/ex4/s1.html docs/textbook4moodle/nextjs/ex4/s2.html docs/textbook4moodle/nextjs/ex4/s3.html docs/textbook4moodle/nextjs/ex4/s4.html docs/textbook4moodle/nextjs/ex4/s5.html
git commit -m "docs: add Next.js supplementary pages s1-s5 for ex4

Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"
```

Expected output: `[master <sha>] docs: add Next.js supplementary pages s1-s5 for ex4`
