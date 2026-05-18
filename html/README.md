# BioDB2026 PHP サンプル

このディレクトリは、BioDB の PHP + PostgreSQL サンプルです。
Docker Compose で起動した PHP/Apache コンテナから配信されます。

## 前提

- リポジトリルートでコンテナを起動済み
- PostgreSQL に demo データベースを作成済み

```powershell
docker compose up -d
docker compose exec postgres psql -U user -d postgres -f /home/user/SQL/demo.sql
```

## ページ一覧

- /sample.php
  - PHP から PostgreSQL へ接続できるか確認する最小サンプル
- /example/search-pdb-simple.php
  - 単純な固定条件（resolution <= 2.5）の検索サンプル
- /example/search.php
  - PDB 検索フォームと結果一覧
  - PDBID、タンパク質名、分類、生物種、分解能で絞り込み可能
- /example/pdb_detail.php?pdbid=XXXX
  - PDB 詳細ページ
  - 構造情報と画像を表示（example/pic 内の JPEG を参照）
- /example/proteins.php
  - Protein 管理ページ
  - 追加、Fav 加算、削除に対応
- /example/search-pdb-simple.php
  - 単純な固定条件（resolution <= 2.5）の検索サンプル
- /adminer-5.4.2.php
  - Adminer 単体ファイル（DB 管理ツール）

## ディレクトリ構成

- sample.php
  - 接続確認ページ
- example/
  - 検索、詳細、管理ページ
- example/lib/
  - DB 接続およびクエリ関数
- example/pic/
  - PDB 詳細ページで利用する画像

## 実装メモ

- DB 接続先は example/lib/db.php で以下に固定されています。
  - host: postgres
  - dbname: demo
  - user: user
  - password: password
- 文字コードは UTF-8 を想定しています。
- proteins.php は PRG パターン（POST-Redirect-GET）で更新処理を実装しています。
