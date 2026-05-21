# 演習1: SQL基礎

> **対象環境:** Docker Compose (PostgreSQL 17 + PHP/Apache + Next.js 15)
> リポジトリをクローンして `docker compose up` で起動できます。

(1) setting.sqlファイルをダウンロードし、SQLファイルを保存してください。保存ファイル名はsetting.sqlにします。
（[setting.sql](../../../SQL/setting.sql) - リポジトリの `./SQL/` フォルダ内）

Docker環境の `./SQL/` フォルダに元々入っています。

(2) 端末を開く。

(3) SQL練習用のSQLファイルをインポート

以下のコマンドを実行します。

```bash
docker compose exec postgres psql -U user -d postgres -f /home/user/SQL/setting.sql
```

※`./SQL/setting.sql` はDocker環境に元々入っています。

(4) psql を起動する

```bash
docker compose exec postgres psql -U user -d database1
```

起動できたら、下図のようにpsqlのモードになる。

(4) 使用するデータベースを選択する。このSQLの復習には「database1」を使用する。

```bash
\c database1
```

PostgreSQLでは、コマンド文の最後にセミコロン（;）を入力してEnterを押した時点で実行される。セミコロン入れる前であれば改行を入れることも可能。

database1のデータベースの構成はリポジトリの `./SQL/` フォルダ内のSQLスキーマを参照。

(5) SQL文（SELECT文）のテスト

```sql
SELECT 商品名 FROM 商品;
```

- SQLは大文字・小文字どちらでもよい。ただし、テーブルの名前は区別される。
- SQL文とテーブル名、列名の間に全角のスペースを入れると認識されない。

(6) SQL例題の例文を必ず入力し出力の確認をして練習をしてください。

※例題中のSELECT文で使う基本構文
