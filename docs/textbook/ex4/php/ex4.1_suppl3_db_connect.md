# 演習4 補足3 (PHP版): PHPからのデータベース接続

> **対象環境:** Docker Compose (PostgreSQL 17 + PHP/Apache + Next.js 15)
> リポジトリをクローンして `docker compose up` で起動できます。

## PostgreSQLとの接続

**DSN（Data Source Name）の作成**

```php
$db_user = "user";             // DB ユーザ名
$db_pass = "password";         // DB パスワード
$db_host = "postgres";         // DB ホスト名（DockerのPostgreSQLサービス名）
$db_name = "demo";             // DB データベース名

$dsn = "pgsql:host={$db_host};dbname={$db_name};options='--client_encoding=UTF8'";
```

※ホスト名は `localhost` ではなく `postgres`（Docker Composeのサービス名）を指定します。

## PDOによるPostgreSQLへの接続

```php
$pdo = new PDO($dsn, $db_user, $db_pass);
```

接続エラーに備えてtry-catchを使うことを推奨します。

```php
try {
    $pdo = new PDO($dsn, $db_user, $db_pass);
} catch (PDOException $e) {
    die("DB接続エラー: " . $e->getMessage());
}
```

---

## SQL検索の実行と出力

**（1）SQL文の設定**

```php
$sql = "SELECT * FROM Protein";
```

**（2）プリペアードステートメントの作成**

```php
$stmh = $pdo->prepare($sql);
```

**（3）SQLの実行**

```php
$stmh->execute();
```

**（4）検索の全結果を $result 配列に格納**

```php
$result = $stmh->fetchAll(PDO::FETCH_ASSOC);
```

※`PDO::FETCH_ASSOC` は連想配列形式で取得するためのオプションです。列名をキーとして `$row["列名"]` でアクセスできます。
