# Textbook Revision (ex4/ex5) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** ex4・ex5 演習テキストを MySQL/旧Docker 環境から PostgreSQL/新Docker (BioDB2026) 環境に全面改訂し、PHP版・Next.js版・発展版を別ファイルで提供する。

**Architecture:** docs/textbook/ 以下に php/ と nextjs/ のサブフォルダを作成し、各演習のHTMLフラグメント（Moodle埋め込み用）を配置する。既存の ex4/ と ex5/ フォルダ内の旧ファイルは削除する。

**Tech Stack:** HTML (Moodle fragment), PostgreSQL, PHP/PDO, Next.js (App Router / Server Components / Server Actions), Drizzle ORM

---

## File Map

| Task | ファイル | 種別 |
|------|---------|------|
| T1 | `docs/textbook/ex4/` → 削除 | 旧フォルダ削除 |
| T1 | `docs/textbook/ex5/` → 削除 | 旧フォルダ削除 |
| T1 | `docs/textbook/php/ex4/`, `php/ex5/`, `nextjs/ex4/`, `nextjs/ex5/` | 新フォルダ作成 |
| T2 | `docs/textbook/php/ex4/ex4.1_Creating_a_Data_Search_Program_Using_PHP.html` | 更新 |
| T3 | `docs/textbook/nextjs/ex4/ex4.2_Creating_a_Data_Search_Program_Using_Next_js.html` | 新規 |
| T4 | `docs/textbook/php/ex5/ex5.1_Building_a_Database_Search_Website_Using_PHP.html` | 更新 |
| T5 | `docs/textbook/php/ex5/ex5.1_adv1_CRUD_Using_PHP.html` | 新規 |
| T6 | `docs/textbook/nextjs/ex5/ex5.2_Building_a_Database_Search_Website_Using_Next_js.html` | 新規 |
| T7 | `docs/textbook/nextjs/ex5/ex5.2_adv1_CRUD_Using_Next_js.html` | 新規 |
| T8 | `docs/textbook/nextjs/ex5/ex5.2_adv2_Building_a_Database_Search_SPA_Using_Next_js.html` | 新規 |

---

## 共通: HTMLフォーマット規則

Moodle埋め込み用フラグメント（`<html>/<head>/<body>` タグなし）。

- コードブロック: `<p style="padding: 10px 15px; background: #1f1f1f; color: #fafafa">`
- 警告（赤）: `<span style="color: #ff0000">`
- 補足（青）: `<span style="color: #0000ff">`
- セクション見出し: `<h5>`
- 手順ステップ: `<p>(N) ...</p>`
- 課題区切り: `<hr />`

---

## Task 1: フォルダ再構成

**Files:**
- Delete: `docs/textbook/ex4/ex4.1_Creating_a_Data_Search_Program_Using_PHP.html`
- Delete: `docs/textbook/ex5/ex5.1_Building_a_Database_Search_Website.html`
- Create dirs: `docs/textbook/php/ex4/`, `docs/textbook/php/ex5/`, `docs/textbook/nextjs/ex4/`, `docs/textbook/nextjs/ex5/`

- [ ] **Step 1: 旧ファイルを削除し新フォルダを作成**

```powershell
# リポジトリルートで実行
Remove-Item -Recurse -Force "docs\textbook\ex4"
Remove-Item -Recurse -Force "docs\textbook\ex5"
New-Item -ItemType Directory -Force "docs\textbook\php\ex4"
New-Item -ItemType Directory -Force "docs\textbook\php\ex5"
New-Item -ItemType Directory -Force "docs\textbook\nextjs\ex4"
New-Item -ItemType Directory -Force "docs\textbook\nextjs\ex5"
```

- [ ] **Step 2: フォルダ構成を確認**

```powershell
Get-ChildItem -Recurse "docs\textbook" | Select-Object FullName
```

期待出力: `ex1/`, `ex2/`, `ex3/`, `php/ex4/`, `php/ex5/`, `nextjs/ex4/`, `nextjs/ex5/` が存在し、旧 `ex4/`, `ex5/` が消えている

- [ ] **Step 3: コミット**

```powershell
git add -A docs/textbook/
git commit -m "refactor: reorganize textbook folder structure into php/ and nextjs/

Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"
```

---

## Task 2: ex4.1 — PHP版データ検索プログラム

**File:** `docs/textbook/php/ex4/ex4.1_Creating_a_Data_Search_Program_Using_PHP.html`

- [ ] **Step 1: ファイルを作成する**

以下の内容でファイルを作成：

```html
<p>
  演習4.1では、データベースを検索し出力をWeb上に表示するPHPプログラムを作成する。
</p>
<p>
  PHPの基礎については、講義資料もしくは以下のmoodleページを参考にしてみて下さい。
</p>
<ul>
  <li>
    <a href="https://im10.el.kyutech.ac.jp/2026/mod/page/view.php?id=55544" target="_blank">PHPの文法の基礎（変数）</a>
  </li>
  <li>
    <a href="https://im10.el.kyutech.ac.jp/2026/mod/page/view.php?id=55545" target="_blank">PHPの文法の基礎（型）</a>
  </li>
  <li>
    <a href="https://im10.el.kyutech.ac.jp/2026/mod/page/view.php?id=55546" target="_blank">PHPによるデータベース制御</a>
  </li>
</ul>
<p>サンプルプログラム</p>
<ul>
  <li>
    <a href="https://im10.el.kyutech.ac.jp/2026/mod/page/view.php?id=55547" target="_blank">PHPサンプルプログラム</a>
  </li>
  <li>
    <a href="https://im10.el.kyutech.ac.jp/2026/mod/page/view.php?id=55548" target="_blank">PHPサンプルプログラム2</a>
  </li>
</ul>

<h5>演習4.1の手順：</h5>
<p>
  例題は <code>html/example/search-pdb-simple.php</code> です。<br>
  <code>demo</code>データベースから3つのテーブルを繋ぎ合わせ、PDBID・Resolution・Protein name・Organismの列を取り出して表示させるプログラムです。
</p>
<p>&nbsp;</p>

<p>
  (0) <strong>demo.sql</strong>をPostgreSQLにインポートしていない場合は、以下のコマンドを実行する。
</p>
<p style="padding: 10px 15px; background: #1f1f1f; color: #fafafa">
  docker compose exec postgres psql -U user -d postgres -f /home/user/SQL/demo.sql
</p>
<p>
  <span style="color: #0000ff">※Docker環境の <code>./SQL/</code> フォルダに <code>demo.sql</code> が入っています。</span>
</p>
<p>&nbsp;</p>

<p>
  (1) 演習環境のリポジトリフォルダ（<code>BioDB2026/</code>）を開き、<strong>html/example/search-pdb-simple.php</strong>を確認してください。
</p>
<p>
  このファイルを参考に、自分用の <code>search-pdb-simple.php</code> を <strong>./html/</strong> のディレクトリに作成してください。
</p>
<p>
  <span style="color: #0000ff">※DB接続の設定例（PostgreSQL用）：</span>
</p>
<p style="padding: 10px 15px; background: #1f1f1f; color: #fafafa">
  $dsn = "pgsql:host=postgres;dbname=demo;options='--client_encoding=UTF8'";<br>
  $pdo = new PDO($dsn, "user", "password");
</p>
<p>&nbsp;</p>

<p>
  (2) WEBブラウザを起動し、URL入力欄に以下のURLを入力してEnterキーを押し、実行結果を確認する。
</p>
<p style="padding: 10px 15px; background: #1f1f1f; color: #fafafa">
  http://localhost/search-pdb-simple.php
</p>
<p>
  （例題は <a href="http://localhost/example/search-pdb-simple.php" target="_blank">http://localhost/example/search-pdb-simple.php</a> に準備してあります）
</p>
<p>
  <span style="color: #0000ff">※PHPはWEBサーバーを介していないと動作しません。必ずWEBブラウザを通してURLからアクセスしてください。</span>
</p>
<p>&nbsp;</p>

<p>
  (3) 例題の出力を確認したら、<strong>自作したデータベースを検索するPHPプログラムを作成し、動作確認をしてください。</strong>
</p>
<ul>
  <li>DB接続のデータベース名（<code>dbname=demo</code> の部分）を自分のDBに変更してください。</li>
  <li>各自が求める検索ができるようにSQL文を工夫してみてください。</li>
  <li>
    <span style="color: #ff0000"><strong>よく出るエラーに関して：</strong></span>
    <a href="https://ict-i.el.kyutech.ac.jp/mod/page/view.php?id=195911" target="_blank">【デバッグ】よく見るエラーと対処法</a>を参考に修正してみてください。
  </li>
</ul>
<p>&nbsp;</p>

<hr />
<p>&nbsp;</p>
<p>
  (4) <strong>【課題】</strong>自作したデータベースを検索するPHPプログラムを「<strong>演習4.1課題提出先</strong>」にアップロードせよ。
</p>
<p>&nbsp;</p>
<p><strong>提出期限：1週目の金曜日(23:59)まで</strong></p>
<ul>
  <li>作成したPHPプログラム（.php）</li>
  <li>何をするプログラムかの説明（コード内にコメントもしくはmoodleのオンラインテキスト）</li>
</ul>
```

- [ ] **Step 2: ファイルが存在することを確認**

```powershell
Test-Path "docs\textbook\php\ex4\ex4.1_Creating_a_Data_Search_Program_Using_PHP.html"
```

期待出力: `True`

- [ ] **Step 3: コミット**

```powershell
git add "docs/textbook/php/ex4/ex4.1_Creating_a_Data_Search_Program_Using_PHP.html"
git commit -m "docs: add ex4.1 PHP data search textbook (PostgreSQL env)

Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"
```

---

## Task 3: ex4.2 — Next.js版データ検索プログラム

**File:** `docs/textbook/nextjs/ex4/ex4.2_Creating_a_Data_Search_Program_Using_Next_js.html`

- [ ] **Step 1: ファイルを作成する**

```html
<p>
  演習4.2では、データベースを検索し出力をWeb上に表示するNext.jsプログラムを作成する。
</p>
<p>
  Next.jsではReactの<strong>Server Component</strong>という仕組みを使うことで、サーバー側でデータベースを検索してHTMLを生成することができます。
</p>
<p>&nbsp;</p>

<h5>演習4.2の手順：</h5>
<p>
  例題は <code>my-app/src/app/search-pdb-simple/page.tsx</code> です。<br>
  <code>demo</code>データベースから3つのテーブルを繋ぎ合わせ、PDBID・Resolution・Protein name・Organismの列を取り出して表示させるプログラムです。
</p>
<p>&nbsp;</p>

<p>
  (0) <strong>nextjsコンテナ</strong>に接続し、開発サーバーを起動する（まだ起動していない場合）。
</p>
<p style="padding: 10px 15px; background: #1f1f1f; color: #fafafa">
  docker compose exec -it nextjs bash
</p>
<p>コンテナ内で：</p>
<p style="padding: 10px 15px; background: #1f1f1f; color: #fafafa">
  npm run dev
</p>
<p>
  <span style="color: #0000ff">※VS Code の Dev Containers 機能で <code>biodb-nextjs</code> コンテナに接続して作業することもできます。その場合はコンテナ内の <code>/app</code> ディレクトリで作業してください。</span>
</p>
<p>&nbsp;</p>

<p>
  (1) 演習環境の <strong>my-app/src/app/search-pdb-simple/page.tsx</strong> を確認してください。
</p>
<p>コードのポイント：</p>
<ul>
  <li><code>export const dynamic = "force-dynamic"</code>：アクセスのたびにサーバー側でDBを検索して最新データを返す設定</li>
  <li><code>db.execute(sql`...`)</code>：Drizzle ORM を使ったSQL実行</li>
  <li>関数に <code>async</code> が付いており、コンポーネント自体がデータを取得できるのがServer Componentの特徴</li>
</ul>
<p>&nbsp;</p>

<p>
  (2) WEBブラウザを起動し、URL入力欄に以下のURLを入力してEnterキーを押し、実行結果を確認する。
</p>
<p style="padding: 10px 15px; background: #1f1f1f; color: #fafafa">
  http://localhost:3000/search-pdb-simple
</p>
<p>&nbsp;</p>

<p>
  (3) 例題の出力を確認したら、<strong>自作したデータベースを検索する新しいページを作成し、動作確認をしてください。</strong>
</p>
<ul>
  <li><code>my-app/src/app/</code> 以下に任意の名前でフォルダを作り、<code>page.tsx</code> を作成する。<br>
    例：<code>my-app/src/app/my-search/page.tsx</code>
  </li>
  <li>SQLは <code>db.execute(sql`SELECT ... FROM ...</code> の形式で記述する。</li>
  <li>自分のデータベース名・テーブル名に合わせて変更する（<code>DATABASE_URL</code> の <code>dbname</code> 部分も確認）。</li>
  <li>
    <span style="color: #0000ff">※コードを変更するとブラウザがホットリロードされて自動反映されます（<code>npm run dev</code> 実行中）。</span>
  </li>
</ul>
<p>&nbsp;</p>

<hr />
<p>&nbsp;</p>
<p>
  (4) <strong>【課題】</strong>自作したデータベースを検索するNext.jsページを「<strong>演習4.2課題提出先</strong>」にアップロードせよ。
</p>
<p>&nbsp;</p>
<p><strong>提出期限：1週目の金曜日(23:59)まで</strong></p>
<ul>
  <li>作成した <code>page.tsx</code>（および関連ファイルがあれば）</li>
  <li>何をするプログラムかの説明（コード内にコメントもしくはmoodleのオンラインテキスト）</li>
</ul>
```

- [ ] **Step 2: ファイルが存在することを確認**

```powershell
Test-Path "docs\textbook\nextjs\ex4\ex4.2_Creating_a_Data_Search_Program_Using_Next_js.html"
```

期待出力: `True`

- [ ] **Step 3: コミット**

```powershell
git add "docs/textbook/nextjs/ex4/ex4.2_Creating_a_Data_Search_Program_Using_Next_js.html"
git commit -m "docs: add ex4.2 Next.js data search textbook

Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"
```

---

## Task 4: ex5.1 — PHP版データベース検索Webサイト

**File:** `docs/textbook/php/ex5/ex5.1_Building_a_Database_Search_Website_Using_PHP.html`

- [ ] **Step 1: ファイルを作成する**

```html
<p>
  演習5.1ではHTMLフォームとPHPを組み合わせたデータベース検索WEBサイトを構築する。
</p>
<p>&nbsp;</p>
<p>
  以下の流れで、まず例題（<a href="http://localhost/example/search.php" target="_blank">http://localhost/example/search.php</a>）を動作確認してから、自作のWebサイトの構築を行ってください。
</p>
<p>&nbsp;</p>
<div>
  <ol>
    <li>GETメソッドで受けた引数を検索条件として、データベース検索をして、その検索結果を動的に表示させるPHPプログラムを作成する。</li>
    <li>フォームに入力したキーワードを引数として送る検索用ページを組み合わせて、データベース検索Webサイトを構築する。</li>
    <li>自分で作成したデータベースを使って、データベースを検索し表示させるWebサイトを構築する。</li>
  </ol>
</div>

<h5>演習5.1の手順：</h5>

<p>
  (1) 演習環境の <strong>html/example/search.php</strong> を確認する。
</p>
<p>
  ※このファイルは、検索フォームとデータベース検索・表示が一体となったPHPプログラムです。<br>
  <span style="color: #0000ff">GETメソッドでURLから受け取った引数を検索条件として、データベースを検索して結果を動的に表示します。</span>
</p>
<p>&nbsp;</p>

<p>
  (2) WEBブラウザを起動し、URL入力欄に以下のURLを入力してEnterキーを押し、実行結果を確認する。
</p>
<p style="padding: 10px 15px; background: #1f1f1f; color: #fafafa">
  http://localhost/example/search.php
</p>
<p>&nbsp;</p>

<p>
  (3) GETメソッドの引数はURLの末尾に「?」をつけて渡すことができる。<br>
  <span style="color: #0000ff">引数を以下の例のようにいろいろ入力してみて、検索結果の表が動的に変化するのを確認してください。</span>
</p>
<p style="padding: 10px 15px; background: #1f1f1f; color: #fafafa">
  http://localhost/example/search.php?id=1AGW
</p>
<p style="padding: 10px 15px; background: #1f1f1f; color: #fafafa">
  http://localhost/example/search.php?res=2.5
</p>
<p style="padding: 10px 15px; background: #1f1f1f; color: #fafafa">
  http://localhost/example/search.php?org=Human&amp;res=2.5
</p>
<p>&nbsp;</p>

<p>
  (4) 例題の出力を確認したら、<strong>自作したデータベースを検索するPHPプログラムを ./html/ に作成してください。</strong>
</p>
<ul>
  <li>まずは例題を自作データベースに変更するところから始めてみてください。</li>
  <li>DB接続のデータベース名（<code>dbname=demo</code> の部分）を自分のDBに変更してください。</li>
  <li>各自が求める検索ができるようにSQL文を工夫してみてください。</li>
</ul>
<p>&nbsp;</p>

<p>
  (5) WEBブラウザでURLからアクセスし、動作確認をしてください。
</p>
<p>
  <span style="color: #ff0000"><strong>※ダブルクリックでhtmlファイルを開かないように注意。</strong>WEBブラウザは立ち上がりますが「Search」ボタンを押してもPHPが動きません。WEBサーバーを介していないためです。</span>
</p>
<p>&nbsp;</p>

<hr />
<p>&nbsp;</p>
<p>
  (6) <strong>【報告】</strong>演習5.1は2日がかりで作成してもらうので、1日目の経過報告として「<strong>演習5.1_経過報告提出先</strong>」に作成したphpを提出してください。
</p>
<p>※<strong>出欠代わり</strong>の経過報告です。<strong>一部のみ提出</strong>で構いません。</p>
<p>&nbsp;</p>

<p>
  (7) <strong>【課題】</strong>演習を行った<code>BioDB2026</code>フォルダをまとめてzip圧縮して「<strong>演習5.1課題提出先</strong>」にアップロードせよ。
</p>
<p>
  コメントとして、工夫した点などアピールしたいポイントを書いておいてください。
</p>
<p>&nbsp;</p>
<p><strong>提出期限：演習終了日の翌週の月曜日13時まで</strong></p>
```

- [ ] **Step 2: ファイルが存在することを確認**

```powershell
Test-Path "docs\textbook\php\ex5\ex5.1_Building_a_Database_Search_Website_Using_PHP.html"
```

期待出力: `True`

- [ ] **Step 3: コミット**

```powershell
git add "docs/textbook/php/ex5/ex5.1_Building_a_Database_Search_Website_Using_PHP.html"
git commit -m "docs: add ex5.1 PHP search website textbook (PostgreSQL env)

Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"
```

---

## Task 5: ex5.1_adv1 — PHP版CRUD（発展）

**File:** `docs/textbook/php/ex5/ex5.1_adv1_CRUD_Using_PHP.html`

- [ ] **Step 1: ファイルを作成する**

```html
<p>
  演習5.1-adv1（発展）では、PHPを使ってデータの追加・削除・更新を行うCRUD操作を実装する。
</p>
<p>
  <strong>CRUD</strong>とは Create（作成）・Read（読み取り）・Update（更新）・Delete（削除）の頭文字をとったもので、Webアプリケーションの基本操作です。
</p>
<p>&nbsp;</p>
<p>
  例題は <a href="http://localhost/example/proteins.php" target="_blank">http://localhost/example/proteins.php</a>（<code>html/example/proteins.php</code>）です。
</p>
<p>&nbsp;</p>

<h5>演習5.1-adv1の手順：</h5>

<p>
  (1) 演習環境の <strong>html/example/proteins.php</strong> を確認する。
</p>
<p>コードのポイント：</p>
<ul>
  <li><strong>PRGパターン（Post-Redirect-Get）</strong>：POSTリクエストでデータを更新した後、<code>header('Location: proteins.php')</code> でリダイレクトすることで、ブラウザの更新ボタンによる二重送信を防ぐ。</li>
  <li><code>$_POST['action']</code> の値（<code>create</code>/<code>delete</code>/<code>fav</code>）によって処理を分岐している。</li>
  <li>フォームの <code>&lt;input type="hidden" name="action" value="create"&gt;</code> でアクションを送信している。</li>
</ul>
<p>&nbsp;</p>

<p>
  (2) WEBブラウザでアクセスして動作確認する。
</p>
<p style="padding: 10px 15px; background: #1f1f1f; color: #fafafa">
  http://localhost/example/proteins.php
</p>
<ul>
  <li>フォームにProtein Name・Organism・Lengthを入力して「Add」ボタンを押し、一覧にデータが追加されることを確認する。</li>
  <li>「Delete」ボタンを押して、データが削除されることを確認する。</li>
  <li>「★ Fav」ボタンを押して、Favカウントが増加することを確認する。</li>
</ul>
<p>&nbsp;</p>

<p>
  (3) 例題を参考に、<strong>自作データベースに対応したCRUDプログラムを ./html/ に作成してください。</strong>
</p>
<ul>
  <li>自分のテーブルの列に合わせてフォームとSQL文を変更してください。</li>
  <li>INSERT文・DELETE文を使ってデータを追加・削除できるようにしてください。</li>
  <li>
    <span style="color: #0000ff">※<code>html/example/lib/protein_queries.php</code> も合わせて確認してください。DB操作を関数として分離している例です。</span>
  </li>
</ul>
<p>&nbsp;</p>

<hr />
<p>&nbsp;</p>
<p>
  (4) <strong>【課題（任意）】</strong>作成したCRUDプログラムを「<strong>演習5.1-adv1課題提出先</strong>」にアップロードせよ。
</p>
<p>
  <span style="color: #0000ff">※発展課題です。余裕があれば取り組んでみてください。</span>
</p>
<p>&nbsp;</p>
<p><strong>提出期限：演習終了日の翌週の月曜日13時まで</strong></p>
```

- [ ] **Step 2: ファイルが存在することを確認**

```powershell
Test-Path "docs\textbook\php\ex5\ex5.1_adv1_CRUD_Using_PHP.html"
```

期待出力: `True`

- [ ] **Step 3: コミット**

```powershell
git add "docs/textbook/php/ex5/ex5.1_adv1_CRUD_Using_PHP.html"
git commit -m "docs: add ex5.1_adv1 PHP CRUD textbook

Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"
```

---

## Task 6: ex5.2 — Next.js版データベース検索Webサイト

**File:** `docs/textbook/nextjs/ex5/ex5.2_Building_a_Database_Search_Website_Using_Next_js.html`

- [ ] **Step 1: ファイルを作成する**

```html
<p>
  演習5.2ではNext.jsのServer Componentを使ってデータベース検索WEBサイトを構築する。
</p>
<p>&nbsp;</p>
<p>
  以下の流れで、まず例題（<a href="http://localhost:3000/example" target="_blank">http://localhost:3000/example</a>）を動作確認してから、自作のWebサイトの構築を行ってください。
</p>
<p>&nbsp;</p>
<div>
  <ol>
    <li><code>searchParams</code>で受け取った引数を検索条件としてデータベース検索し、結果を動的に表示するServer Componentページを作成する。</li>
    <li>GETメソッドのHTMLフォームと組み合わせてデータベース検索Webサイトとして完成させる。</li>
    <li>自分で作成したデータベースを使って、データベースを検索し表示させるWebサイトを構築する。</li>
  </ol>
</div>

<h5>演習5.2の手順：</h5>

<p>
  (0) <strong>nextjsコンテナ</strong>で開発サーバーが起動していることを確認する（まだの場合は起動する）。
</p>
<p style="padding: 10px 15px; background: #1f1f1f; color: #fafafa">
  docker compose exec -it nextjs bash
</p>
<p>コンテナ内で：</p>
<p style="padding: 10px 15px; background: #1f1f1f; color: #fafafa">
  npm run dev
</p>
<p>&nbsp;</p>

<p>
  (1) 演習環境の <strong>my-app/src/app/example/page.tsx</strong> を確認する。
</p>
<p>コードのポイント：</p>
<ul>
  <li><code>searchParams</code>：URLのクエリパラメータ（<code>?id=1AGW</code> 等）を受け取るNext.jsの仕組み。</li>
  <li>フォームの <code>method="get"</code> により、検索ボタンを押すとURLにパラメータが付いてページが再読み込みされる。</li>
  <li>Server Componentのためフォーム送信もURLアクセスもサーバー側でDBを検索して結果を返す。</li>
</ul>
<p>&nbsp;</p>

<p>
  (2) WEBブラウザを起動し、URL入力欄に以下のURLを入力してEnterキーを押し、実行結果を確認する。
</p>
<p style="padding: 10px 15px; background: #1f1f1f; color: #fafafa">
  http://localhost:3000/example
</p>
<p>&nbsp;</p>

<p>
  (3) URLパラメータを以下の例のようにいろいろ入力してみて、検索結果が動的に変化することを確認してください。
</p>
<p style="padding: 10px 15px; background: #1f1f1f; color: #fafafa">
  http://localhost:3000/example?id=1AGW
</p>
<p style="padding: 10px 15px; background: #1f1f1f; color: #fafafa">
  http://localhost:3000/example?res=2.5
</p>
<p style="padding: 10px 15px; background: #1f1f1f; color: #fafafa">
  http://localhost:3000/example?org=Human&amp;res=2.5
</p>
<p>&nbsp;</p>

<p>
  (4) 例題の出力を確認したら、<strong>自作したデータベースを検索するNext.jsページを作成してください。</strong>
</p>
<ul>
  <li><code>my-app/src/app/</code> 以下に任意の名前でフォルダを作り、<code>page.tsx</code> を作成する。</li>
  <li>まずは例題を自作データベースに変更するところから始めてみてください。</li>
  <li><code>DATABASE_URL</code>（<code>.env</code>ファイル）のデータベース名（<code>/demo</code> の部分）を自分のDBに変更してください。</li>
  <li>
    <span style="color: #0000ff">※コードを変更するとブラウザがホットリロードされて自動反映されます（<code>npm run dev</code> 実行中）。</span>
  </li>
</ul>
<p>&nbsp;</p>

<hr />
<p>&nbsp;</p>
<p>
  (5) <strong>【報告】</strong>演習5.2は2日がかりで作成してもらうので、1日目の経過報告として「<strong>演習5.2_経過報告提出先</strong>」に作成したpage.tsxを提出してください。
</p>
<p>※<strong>出欠代わり</strong>の経過報告です。<strong>一部のみ提出</strong>で構いません。</p>
<p>&nbsp;</p>

<p>
  (6) <strong>【課題】</strong>演習を行った<code>BioDB2026</code>フォルダをまとめてzip圧縮して「<strong>演習5.2課題提出先</strong>」にアップロードせよ。
</p>
<p>
  コメントとして、工夫した点などアピールしたいポイントを書いておいてください。
</p>
<p>&nbsp;</p>
<p><strong>提出期限：演習終了日の翌週の月曜日13時まで</strong></p>
```

- [ ] **Step 2: ファイルが存在することを確認**

```powershell
Test-Path "docs\textbook\nextjs\ex5\ex5.2_Building_a_Database_Search_Website_Using_Next_js.html"
```

期待出力: `True`

- [ ] **Step 3: コミット**

```powershell
git add "docs/textbook/nextjs/ex5/ex5.2_Building_a_Database_Search_Website_Using_Next_js.html"
git commit -m "docs: add ex5.2 Next.js search website textbook

Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"
```

---

## Task 7: ex5.2_adv1 — Next.js版CRUD（発展）

**File:** `docs/textbook/nextjs/ex5/ex5.2_adv1_CRUD_Using_Next_js.html`

- [ ] **Step 1: ファイルを作成する**

```html
<p>
  演習5.2-adv1（発展）では、Next.jsの<strong>Server Actions</strong>を使ってデータの追加・削除を行うCRUD操作を実装する。
</p>
<p>
  Server Actionsとは、Next.jsでサーバー側の処理（DB書き込みなど）を関数として定義し、クライアントから呼び出せる仕組みです。
</p>
<p>&nbsp;</p>
<p>
  例題は <a href="http://localhost:3000/example/proteins" target="_blank">http://localhost:3000/example/proteins</a>（<code>my-app/src/app/example/proteins/</code>）です。
</p>
<p>&nbsp;</p>

<h5>演習5.2-adv1の手順：</h5>

<p>
  (1) 演習環境の <strong>my-app/src/app/example/proteins/</strong> フォルダのファイル群を確認する。
</p>
<ul>
  <li><code>page.tsx</code>：タンパク質一覧の表示と削除・Favボタン（Server Component）</li>
  <li><code>actions.ts</code>：<code>"use server"</code> ディレクティブを持つServer Actions。<code>deleteProteinAction</code>・<code>incrementProteinFavAction</code> などのDB書き込み処理を定義。</li>
  <li><code>protein-create-form.tsx</code>：データ追加フォーム（Client Component）</li>
  <li><code>delete-protein-dialog.tsx</code>：削除確認ダイアログ（Client Component）</li>
</ul>
<p>
  <span style="color: #0000ff">※<code>actions.ts</code> の冒頭に <code>"use server"</code> があることで、サーバー側で実行されるServer Actionになります。クライアントから直接呼び出せますが、処理はサーバーで行われます。</span>
</p>
<p>&nbsp;</p>

<p>
  (2) WEBブラウザでアクセスして動作確認する。
</p>
<p style="padding: 10px 15px; background: #1f1f1f; color: #fafafa">
  http://localhost:3000/example/proteins
</p>
<ul>
  <li>フォームにProtein Name・Organism・Lengthを入力して「Add Protein」ボタンを押し、一覧にデータが追加されることを確認する。</li>
  <li>「Delete」ボタンを押して確認ダイアログを経てデータが削除されることを確認する。</li>
  <li>「+1 Fav」ボタンを押して、Favカウントが増加することを確認する。</li>
</ul>
<p>&nbsp;</p>

<p>
  (3) ダイナミックルーティングの例として、<code>my-app/src/app/example/pdb/[pdbid]/page.tsx</code> も確認してみてください。
</p>
<ul>
  <li>フォルダ名の <code>[pdbid]</code> がURLのパラメータに対応している。</li>
  <li><code>/example/pdb/1AGW</code> にアクセスすると、<code>params.pdbid</code> に <code>"1AGW"</code> が渡される。</li>
</ul>
<p>&nbsp;</p>

<p>
  (4) 例題を参考に、<strong>自作データベースに対応したCRUDページを作成してください。</strong>
</p>
<ul>
  <li><code>my-app/src/app/</code> 以下に任意のフォルダを作り、<code>page.tsx</code> と <code>actions.ts</code> を作成する。</li>
  <li><code>actions.ts</code> に <code>"use server"</code> を記述し、INSERT・DELETE処理をServer Actionとして定義する。</li>
  <li>自分のテーブルの列に合わせてフォームとSQL文を変更してください。</li>
</ul>
<p>&nbsp;</p>

<hr />
<p>&nbsp;</p>
<p>
  (5) <strong>【課題（任意）】</strong>作成したCRUDページを「<strong>演習5.2-adv1課題提出先</strong>」にアップロードせよ。
</p>
<p>
  <span style="color: #0000ff">※発展課題です。余裕があれば取り組んでみてください。</span>
</p>
<p>&nbsp;</p>
<p><strong>提出期限：演習終了日の翌週の月曜日13時まで</strong></p>
```

- [ ] **Step 2: ファイルが存在することを確認**

```powershell
Test-Path "docs\textbook\nextjs\ex5\ex5.2_adv1_CRUD_Using_Next_js.html"
```

期待出力: `True`

- [ ] **Step 3: コミット**

```powershell
git add "docs/textbook/nextjs/ex5/ex5.2_adv1_CRUD_Using_Next_js.html"
git commit -m "docs: add ex5.2_adv1 Next.js CRUD textbook

Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"
```

---

## Task 8: ex5.2_adv2 — Next.js SPA版（発展）

**File:** `docs/textbook/nextjs/ex5/ex5.2_adv2_Building_a_Database_Search_SPA_Using_Next_js.html`

- [ ] **Step 1: ファイルを作成する**

```html
<p>
  演習5.2-adv2（発展）では、Next.jsの<strong>Client Component</strong>とServer Actionsを組み合わせて、ページ遷移なしにリアルタイムでデータベース検索を行うSPA（Single Page Application）型の検索Webサイトを構築する。
</p>
<p>
  ex5.2のServer Componentではフォーム送信のたびにページ全体がサーバーから送られてきましたが、SPA版では検索フォームへの入力中に自動で検索結果が更新されます。
</p>
<p>&nbsp;</p>
<p>
  例題は <a href="http://localhost:3000/example-spa" target="_blank">http://localhost:3000/example-spa</a>（<code>my-app/src/app/example-spa/</code>）です。
</p>
<p>&nbsp;</p>

<h5>演習5.2-adv2の手順：</h5>

<p>
  (1) 演習環境の <strong>my-app/src/app/example-spa/</strong> フォルダのファイル群を確認する。
</p>
<ul>
  <li><code>page.tsx</code>：<code>"use client"</code> ディレクティブを持つClient Componentのシェル。Reactの <code>useState</code>・<code>useEffect</code> でクライアント側の状態を管理する。</li>
  <li><code>actions.ts</code>：Server Actions。<code>searchPdbAction</code> がクライアントから呼ばれるたびにサーバー側でDB検索を行う。</li>
  <li><code>search-form.tsx</code>：検索フォームのコンポーネント。</li>
  <li><code>search-results-table.tsx</code>：検索結果テーブルのコンポーネント。</li>
  <li><code>client-state.ts</code>：状態管理のロジックをまとめたファイル。</li>
</ul>
<p>
  <span style="color: #0000ff">※Client ComponentとServer Componentの違い：</span><br>
  <span style="color: #0000ff">・Server Component（デフォルト）：サーバーで実行され、<code>useState</code>/<code>useEffect</code> は使えない。初期データ取得に使う。</span><br>
  <span style="color: #0000ff">・Client Component（<code>"use client"</code>）：ブラウザで実行され、インタラクティブな動作が実現できる。</span>
</p>
<p>&nbsp;</p>

<p>
  (2) WEBブラウザでアクセスして動作確認する。
</p>
<p style="padding: 10px 15px; background: #1f1f1f; color: #fafafa">
  http://localhost:3000/example-spa
</p>
<ul>
  <li>検索フォームに文字を入力すると、入力が止まってから少し経つと自動的に検索結果が更新されることを確認する（デバウンス：250ms後に検索実行）。</li>
  <li>検索結果のPDBIDをクリックすると、ページ遷移なしに詳細情報が表示されることを確認する。</li>
</ul>
<p>&nbsp;</p>

<p>
  (3) デバウンス検索の仕組みを <code>page.tsx</code> で確認する。
</p>
<ul>
  <li><code>useEffect</code> の依存配列に <code>state.filters</code> が入っており、フィルターが変わるたびに発火する。</li>
  <li><code>setTimeout</code> で250ms後に <code>searchPdbAction</code>（Server Action）を呼び出している。</li>
  <li>入力中に新しい変更があった場合は <code>clearTimeout</code> で前のタイマーをキャンセルする。</li>
</ul>
<p>&nbsp;</p>

<p>
  (4) 例題を参考に、<strong>自作データベースに対応したSPA型検索ページを作成してください。</strong>
</p>
<ul>
  <li><code>my-app/src/app/</code> 以下に任意のフォルダを作り、<code>page.tsx</code>（Client Component）と <code>actions.ts</code>（Server Actions）を作成する。</li>
  <li><code>actions.ts</code> に <code>"use server"</code>、<code>page.tsx</code> の先頭に <code>"use client"</code> をそれぞれ記述する。</li>
  <li>自分のテーブルに合わせて検索フォームと検索結果の表示を変更してください。</li>
</ul>
<p>&nbsp;</p>

<hr />
<p>&nbsp;</p>
<p>
  (5) <strong>【課題（任意）】</strong>作成したSPA型検索ページを「<strong>演習5.2-adv2課題提出先</strong>」にアップロードせよ。
</p>
<p>
  <span style="color: #0000ff">※発展課題です。余裕があれば取り組んでみてください。</span>
</p>
<p>&nbsp;</p>
<p><strong>提出期限：演習終了日の翌週の月曜日13時まで</strong></p>
```

- [ ] **Step 2: ファイルが存在することを確認**

```powershell
Test-Path "docs\textbook\nextjs\ex5\ex5.2_adv2_Building_a_Database_Search_SPA_Using_Next_js.html"
```

期待出力: `True`

- [ ] **Step 3: コミット**

```powershell
git add "docs/textbook/nextjs/ex5/ex5.2_adv2_Building_a_Database_Search_SPA_Using_Next_js.html"
git commit -m "docs: add ex5.2_adv2 Next.js SPA search textbook

Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"
```

---

## セルフレビュー

### Spec coverage check
- [x] ex4.1 PHP検索プログラム (T2)
- [x] ex4.2 Next.js検索プログラム (T3)
- [x] ex5.1 PHP検索Webサイト (T4)
- [x] ex5.1_adv1 PHP CRUD (T5)
- [x] ex5.2 Next.js検索Webサイト (T6)
- [x] ex5.2_adv1 Next.js CRUD (T7)
- [x] ex5.2_adv2 Next.js SPA (T8)
- [x] フォルダ再構成 (T1)
- [x] Moodleリンク維持
- [x] HTMLフォーマット統一
- [x] 課題提出は BioDB2026 フォルダ全体zip

### No placeholders: ✅ すべてのステップに実際のHTML/コマンドを記載

### Consistency: ✅ コンテナ名・URL・ファイルパスはすべて現環境に統一
