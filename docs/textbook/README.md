# データベースプログラミング演習 テキスト

> **対象環境:** Docker Compose (PostgreSQL 17 + PHP/Apache + Next.js 15)
> リポジトリをクローンして `docker compose up` で起動できます。

このディレクトリには、データベースプログラミング演習のテキストが Markdown 形式で収録されています。
各ファイルは `docs/textbook4moodle/` 内の HTML ファイルから変換されたものです。

## 演習一覧

### 演習1: SQL基礎

| ファイル | 内容 |
|---------|------|
| [ex1/ex1_main.md](ex1/ex1_main.md) | `setting.sql` のインポート、psql の起動、SELECT 文の基本練習 |

---

### 演習2: データベース設計

| ファイル | 内容 |
|---------|------|
| [ex2/ex2_main.md](ex2/ex2_main.md) | E-R図設計 → 正規化 → Excel作成 → TA確認の手順 |
| [ex2/ex2_suppl1_db_design.md](ex2/ex2_suppl1_db_design.md) | 設計の4ステップ：1テーブル → 重複分離 → 外部キー結合の具体例 |
| [ex2/ex2_suppl2_db_design2.md](ex2/ex2_suppl2_db_design2.md) | 正規化の実践（グルメ採点サイト例で3テーブルまで段階的正規化） |

---

### 演習3: データベース作成

| ファイル | 内容 |
|---------|------|
| [ex3/ex3_main.md](ex3/ex3_main.md) | 自作 SQL ファイルの作成・インポート・psql での確認・検索テスト |
| [ex3/ex3_suppl1_adminer.md](ex3/ex3_suppl1_adminer.md) | Adminer のログイン・DB確認・SQL実行・CSV インポート手順 |

---

### 演習4: Web データベース検索インターフェイスの作成

#### PHP版

| ファイル | 内容 |
|---------|------|
| [ex4/php/ex4.1_main.md](ex4/php/ex4.1_main.md) | `search-pdb-simple.php` を参考に DB 検索 PHP プログラムを作成する手順 |
| [ex4/php/ex4.1_suppl1_php_basics.md](ex4/php/ex4.1_suppl1_php_basics.md) | PHP 基礎：変数・代入・文字列連結・`$_GET`/`$_POST` |
| [ex4/php/ex4.1_suppl2_php_types.md](ex4/php/ex4.1_suppl2_php_types.md) | PHP の型：スカラー型・複合型・特別型の解説 |
| [ex4/php/ex4.1_suppl3_db_connect.md](ex4/php/ex4.1_suppl3_db_connect.md) | PDO で PostgreSQL に接続し SELECT 結果を取得する手順 |
| [ex4/php/ex4.1_suppl4_hello_world.md](ex4/php/ex4.1_suppl4_hello_world.md) | Hello World: HTML 版と PHP 版の比較・`<?php` モード切り替え |
| [ex4/php/ex4.1_suppl5_arrays.md](ex4/php/ex4.1_suppl5_arrays.md) | 配列・ループ：`array()` 初期化と `for` 文で配列要素を HTML 出力 |

#### Next.js版

| ファイル | 内容 |
|---------|------|
| [ex4/nextjs/ex4.2_main.md](ex4/nextjs/ex4.2_main.md) | nextjs コンテナ接続 → 例題確認 → 自作 DB ページ作成の手順 |
| [ex4/nextjs/ex4.2_suppl1_typescript.md](ex4/nextjs/ex4.2_suppl1_typescript.md) | TypeScript 基礎：変数・型・テンプレートリテラル・アロー関数・async/await |
| [ex4/nextjs/ex4.2_suppl2_jsx_react.md](ex4/nextjs/ex4.2_suppl2_jsx_react.md) | JSX/React 基礎：関数コンポーネント・式埋め込み・map・Link コンポーネント |
| [ex4/nextjs/ex4.2_suppl3_app_router.md](ex4/nextjs/ex4.2_suppl3_app_router.md) | App Router：フォルダ = URL 対応・Server/Client Component・新ページ作成手順 |
| [ex4/nextjs/ex4.2_suppl4_db_connect.md](ex4/nextjs/ex4.2_suppl4_db_connect.md) | DB 接続設定：`.env`・Drizzle ORM・`sql\`...\`` タグ・型定義・基本パターン |
| [ex4/nextjs/ex4.2_suppl5_code_walk.md](ex4/nextjs/ex4.2_suppl5_code_walk.md) | `search-pdb-simple/page.tsx` 全コード解説（import/type/fetchRows/JSX テーブル） |

---

### 演習5: データベース操作 Web アプリの完成

#### PHP版

| ファイル | 内容 |
|---------|------|
| [ex5/php/ex5.1_main.md](ex5/php/ex5.1_main.md) | GET パラメータを使った `search.php` での DB 検索 Web サイト構築手順 |
| [ex5/php/ex5.1_adv1_crud.md](ex5/php/ex5.1_adv1_crud.md) | `proteins.php` を例にした CRUD（追加・削除・更新）操作の実装手順 |
| [ex5/php/ex5.1_adv2_detail_link.md](ex5/php/ex5.1_adv2_detail_link.md) | 一覧（`search.php`）→ 詳細（`pdb_detail.php`）のページ遷移実装 |

#### Next.js版

| ファイル | 内容 |
|---------|------|
| [ex5/nextjs/ex5.2_main.md](ex5/nextjs/ex5.2_main.md) | Server Component + GET フォームで DB 検索 Web サイトを構築する手順 |
| [ex5/nextjs/ex5.2_adv1_crud.md](ex5/nextjs/ex5.2_adv1_crud.md) | Server Actions を使った CRUD 操作（追加・削除・Fav）の実装手順 |
| [ex5/nextjs/ex5.2_adv2_detail_link.md](ex5/nextjs/ex5.2_adv2_detail_link.md) | 動的ルート `[pdbid]` で一覧 → 詳細ページへのリンク遷移を実装 |
| [ex5/nextjs/ex5.2_adv3_spa.md](ex5/nextjs/ex5.2_adv3_spa.md) | Client Component + Server Action でデバウンス付き SPA 型 DB 検索を構築 |
| [ex5/nextjs/ex5.2_suppl1_code_walk.md](ex5/nextjs/ex5.2_suppl1_code_walk.md) | `example/page.tsx` 全コード解説（searchParams・GET フォーム・`pdb.ts` 内 SQL） |
| [ex5/nextjs/ex5.2_suppl2_spa_walk.md](ex5/nextjs/ex5.2_suppl2_spa_walk.md) | `example-spa/` の SPA コード解説（useState・useEffect・デバウンス・props） |
| [ex5/nextjs/ex5.2_suppl3_crud_walk.md](ex5/nextjs/ex5.2_suppl3_crud_walk.md) | `example/proteins/` の CRUD コード全解説（Server Actions・useActionState・SQL 4種） |

---

## リポジトリ内の主要ファイル

| ファイル/フォルダ | 説明 |
|----------------|------|
| [`../../SQL/demo.sql`](/SQL/demo.sql) | デモデータベース（PDB タンパク質データ） |
| [`../../SQL/`](/SQL/) | SQL セットアップファイル一式 |
| [`../../html/example/`](/html/example/) | PHP サンプルファイル一式 |
| [`../../my-app/src/app/example/page.tsx`](/my-app/src/app/example/page.tsx) | Next.js サンプルページ |
| [`../../my-app/src/app/example-spa/`](/my-app/src/app/example-spa/) | Next.js SPA サンプル |
| [`../../my-app/src/lib/pdb.ts`](/my-app/src/lib/pdb.ts) | PDB データ取得ライブラリ |
| [`../../my-app/src/lib/proteins.ts`](/my-app/src/lib/proteins.ts) | タンパク質データ操作ライブラリ |

## 環境情報

```
Services:
  - postgres  → port 5432  (PostgreSQL 17)
  - php       → port 80    (PHP/Apache)
  - nextjs    → port 3000  (Next.js 15)

DB接続情報:
  host:     postgres  (Docker ネットワーク内)
  user:     user
  password: password
  database: demo
```

起動方法:

```bash
git clone https://github.com/fuji3to4/BioDB2026.git
cd BioDB2026
docker compose up
```
