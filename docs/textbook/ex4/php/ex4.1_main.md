# 演習4 (PHP版): Webデータベース検索インターフェイスの作成

> **対象環境:** Docker Compose (PostgreSQL 17 + PHP/Apache + Next.js 15)
> リポジトリをクローンして `docker compose up` で起動できます。

演習4.1では、データベースを検索し出力をWeb上に表示するPHPプログラムを作成する。

PHPの基礎については、以下の補足資料を参考にしてください。

* [PHPの文法の基礎（変数）](ex4.1_suppl1_php_basics.md)
* [PHPの文法の基礎（型）](ex4.1_suppl2_php_types.md)
* [PHPによるデータベース制御](ex4.1_suppl3_db_connect.md)

サンプルプログラム

* [PHPサンプルプログラム](ex4.1_suppl4_hello_world.md)
* [PHPサンプルプログラム2](ex4.1_suppl5_arrays.md)

## 演習4.1の手順：

例題は [`html/example/search-pdb-simple.php`](../../../../html/example/search-pdb-simple.php) です。
`demo`データベースから3つのテーブルを繋ぎ合わせ、PDBID・Resolution・Protein name・Organismの列を取り出して表示させるプログラムです。

(0) **demo2026-backup.sql**をPostgreSQLにインポートしていない場合は、以下のコマンドを実行する。

```bash
docker compose exec postgres psql -U user -d postgres -f /home/user/SQL/demo2026-backup.sql
```

※Docker環境の `./SQL/` フォルダに [`demo2026-backup.sql`](../../../../SQL/demo2026-backup.sql) が入っています。

(1) 演習環境のリポジトリフォルダ（`BioDB2026/`）を開き、[**html/example/search-pdb-simple.php**](../../../../html/example/search-pdb-simple.php) を確認してください。

このファイルを参考に、自分用の `search-pdb-simple.php` を **./html/** のディレクトリに作成してください。

※DB接続の設定例（PostgreSQL用）：

```php
$dsn = "pgsql:host=postgres;dbname=demo;options='--client_encoding=UTF8'";
$pdo = new PDO($dsn, "user", "password");
```

(2) WEBブラウザを起動し、URL入力欄に以下のURLを入力してEnterキーを押し、実行結果を確認する。

```
http://localhost/search-pdb-simple.php
```

（例題は <http://localhost/example/search-pdb-simple.php> に準備してあります）

※PHPはWEBサーバーを介していないと動作しません。必ずWEBブラウザを通してURLからアクセスしてください。

(3) 例題の出力を確認したら、**自作したデータベースを検索するPHPプログラムを作成し、動作確認をしてください。**

* DB接続のデータベース名（`dbname=demo` の部分）を自分のDBに変更してください。
* 各自が求める検索ができるようにSQL文を工夫してみてください。
* **よく出るエラーに関して：**
  【デバッグ】よく見るエラーと対処法を参考に修正してみてください。
