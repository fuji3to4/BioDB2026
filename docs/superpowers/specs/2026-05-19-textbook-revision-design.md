# BioDB2026 テキスト改訂 設計書

## 問題と目的

既存の演習テキスト（ex4, ex5）はMySQL環境・旧Docker構成を前提に書かれており、
現在のBioDB2026演習環境（PostgreSQL + PHP + Next.js on Docker Compose）と乖離している。

目的：
- ex4, ex5 を現在の演習環境に合わせて完全改訂
- PHP版とNext.js版を別ファイルで提供
- フォルダを `php/` と `nextjs/` に分けて混乱を防ぐ
- CRUD演習・SPA演習も発展版として追加
- 全ファイルのHTMLフォーマットを統一

---

## 現在の演習環境

| サービス   | コンテナ名         | URL / ポート           |
|-----------|-------------------|----------------------|
| PostgreSQL | biodb-postgres     | localhost:5432        |
| PHP/Apache | biodb-php          | http://localhost/     |
| Next.js    | biodb-nextjs       | http://localhost:3000 |

- PHP ファイル置き場: `./html/`
- Next.js ファイル置き場: `./my-app/src/app/`
- 例題PHP: `./html/example/`
- 例題Next.js: `./my-app/src/app/` 以下の各ディレクトリ

---

## フォルダ構成（変更後）

```
docs/textbook/
├── ex1/           ← 変更なし（共通 SQL 演習）
├── ex2/           ← 変更なし（DB 設計演習）
├── ex3/           ← 変更なし（DB 作成演習）
├── php/
│   ├── ex4/
│   │   └── ex4.1_Creating_a_Data_Search_Program_Using_PHP.html
│   └── ex5/
│       ├── ex5.1_Building_a_Database_Search_Website_Using_PHP.html
│       └── ex5.1_adv1_CRUD_Using_PHP.html
└── nextjs/
    ├── ex4/
    │   └── ex4.2_Creating_a_Data_Search_Program_Using_Next_js.html
    └── ex5/
        ├── ex5.2_Building_a_Database_Search_Website_Using_Next_js.html
        ├── ex5.2_adv1_CRUD_Using_Next_js.html
        └── ex5.2_adv2_Building_a_Database_Search_SPA_Using_Next_js.html
```

既存の `docs/textbook/ex4/` と `docs/textbook/ex5/` フォルダは削除し、
ファイルを上記構成に移動・改訂する。

---

## HTMLフォーマット統一規則

全ファイルはMoodle埋め込み用のHTMLフラグメント（`<html>/<head>/<body>` タグなし）。

| 要素                 | スタイル                                                              |
|---------------------|---------------------------------------------------------------------|
| コードブロック        | `<p style="padding: 10px 15px; background: #1f1f1f; color: #fafafa">` |
| 警告・注意（赤）      | `<span style="color: #ff0000">`                                      |
| 補足説明（青）        | `<span style="color: #0000ff">`                                      |
| セクション見出し      | `<h5>`                                                               |
| 手順ステップ          | `<p>(N) ...</p>` 形式で番号付け                                       |
| 課題セクション区切り  | `<hr />`                                                             |
| 強調                 | `<strong>`                                                           |
| 外部リンク           | `<a href="..." target="_blank">...</a>`                              |
| Moodleリンク         | そのまま維持（今回は変更しない）                                        |

---

## 各ファイルの内容設計

### ex4.1 (PHP版・更新)
**参照コード**: `html/example/search-pdb-simple.php`  
**タイトル**: 演習4.1 PHPによるデータ検索プログラムの作成

手順:
- (0) demo.sql のインポート確認（未実施の場合）
  ```
  docker compose exec postgres psql -U user -d postgres -f /home/user/SQL/demo.sql
  ```
- (1) `html/example/search-pdb-simple.php` を確認し、`./html/` に自分用ファイルを作成
- (2) ブラウザで `http://localhost/search-pdb-simple.php` にアクセスして確認
- (3) 自作DBを検索するPHPプログラムを作成  
  ※PHPはWEBサーバー経由必須（`http://localhost/` からアクセス）  
  ※PostgreSQL接続: `pgsql:host=postgres;...` DSN + PDO

課題: 作成した `.php` ファイルとコメント（何をするプログラムかの説明）を提出

---

### ex4.2 (Next.js版・新規)
**参照コード**: `my-app/src/app/search-pdb-simple/page.tsx`  
**タイトル**: 演習4.2 Next.jsによるデータ検索プログラムの作成

手順:
- (0) nextjsコンテナに接続し `npm run dev` を実行
  ```
  docker compose exec -it nextjs bash
  # コンテナ内で:
  npm run dev
  ```
- (1) `my-app/src/app/search-pdb-simple/page.tsx` を確認
- (2) ブラウザで `http://localhost:3000/search-pdb-simple` にアクセス
- (3) Server Component・Drizzle ORM の仕組みを理解
  - `export const dynamic = "force-dynamic"` の意味
  - `db.execute(sql\`...\`)` によるDB問い合わせ
- (4) 自作DBを検索する新しいページを `my-app/src/app/<任意名>/page.tsx` に作成

課題: 作成した `page.tsx` を提出

---

### ex5.1 (PHP版・更新)
**参照コード**: `html/example/search.php`（フォーム+検索一体型）  
**タイトル**: 演習5.1 PHPによるデータベース検索Webサイトの構築

流れ（ol）:
1. GETメソッドで受けた引数を検索条件としてDBを検索し動的に表示するPHPを作成
2. 検索フォームと検索結果を組み合わせてデータベース検索Webサイトを構築
3. 自作DBで検索Webサイトを構築

手順:
- (1) `html/example/search-pdb-simple.php`（シンプル版）と `html/example/search.php`（フォーム+検索版）を確認
- (2) `http://localhost/example/search.php` にアクセスして動作確認
- (3) GETパラメータを試す
  - `http://localhost/example/search.php?id=1AGW`
  - `http://localhost/example/search.php?res=2.5`
  - `http://localhost/example/search.php?org=Human&res=2.5`
- (4) 自作DBに合わせたPHPプログラムを `./html/` に作成
- (5) 検索フォームと検索結果を組み合わせてWebサイトを完成

途中経過提出（出欠確認）+ 最終課題: 演習で使った `html/` フォルダをzip圧縮して提出（工夫した点をコメントに記載）(PHP CRUD版・新規)
**参照コード**: `html/example/proteins.php` + `html/example/pdb_detail.php`  
**タイトル**: 演習5.1-adv1 PHPによるCRUD操作（発展）

内容:
- Create, Read, Update, Delete の全操作を含むPHPサンプル
- PRGパターン（Post-Redirect-Get）の説明
- フォームを使ったデータ追加・削除の実装
- `http://localhost/example/proteins.php` での動作確認

課題: 任意提出（発展課題）

---

### ex5.2 (Next.js版・新規)
**参照コード**: `my-app/src/app/example/page.tsx`  
**タイトル**: 演習5.2 Next.jsによるデータベース検索Webサイトの構築

流れ（ol）:
1. searchParamsでDB検索結果を動的に表示するServer Componentを作成
2. GETメソッドのHTMLフォームを組み合わせてデータベース検索Webサイトを構築
3. 自作DBで検索Webサイトを構築

手順:
- (0) nextjsコンテナで `npm run dev` 確認
- (1) `my-app/src/app/example/page.tsx` を確認（searchParams + form）
- (2) `http://localhost:3000/example` にアクセス
- (3) URLパラメータを試す
  - `http://localhost:3000/example?id=1AGW`
  - `http://localhost:3000/example?res=2.5`
- (4) 自作DB版の検索ページを `my-app/src/app/<任意名>/page.tsx` に作成

途中経過提出（出欠確認）+ 最終課題: 演習で使った `my-app/` フォルダをzip圧縮して提出（工夫した点をコメントに記載）

---

### ex5.2_adv1 (Next.js CRUD版・新規)
**参照コード**: `my-app/src/app/example/proteins/` + `my-app/src/app/example/pdb/[pdbid]/`  
**タイトル**: 演習5.2-adv1 Next.jsによるCRUD操作（発展）

内容:
- Server Actions を使ったCreate/Delete操作
- ダイナミックルーティング `[pdbid]` の説明
- `http://localhost:3000/example/proteins` での動作確認

課題: 任意提出（発展課題）

---

### ex5.2_adv2 (Next.js SPA版・新規)
**参照コード**: `my-app/src/app/example-spa/`  
**タイトル**: 演習5.2-adv2 Next.jsによるSPA型データベース検索Webサイト（発展）

内容:
- `"use client"` Client Componentsの説明
- Server Actionsとの組み合わせ（actions.ts）
- デバウンス検索（入力250ms後に自動検索）
- `http://localhost:3000/example-spa` での動作確認
- コンポーネント構造の理解（client-state.ts, search-form.tsx, search-results-table.tsx）

課題: 任意提出（発展課題）

---

## 旧ファイルの扱い

- `docs/textbook/ex4/ex4.1_Creating_a_Data_Search_Program_Using_PHP.html` → 削除（php/ex4/ に移行）
- `docs/textbook/ex5/ex5.1_Building_a_Database_Search_Website.html` → 削除（php/ex5/ に移行）
- `docs/textbook/ex4/` フォルダ → 空になったら削除
- `docs/textbook/ex5/` フォルダ → 空になったら削除

---

## Moodleリンクについて

- `https://im10.el.kyutech.ac.jp/2026/...` のリンクはそのまま維持
- 将来的にリポジトリ内参照版を別フォルダに作る計画あり（今回は対象外）
