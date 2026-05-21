# 演習4 補足4 (Next.js版): データベース接続

> **対象環境:** Docker Compose (PostgreSQL 17 + PHP/Apache + Next.js 15)
> リポジトリをクローンして `docker compose up` で起動できます。

## データベース接続の設定

**.envファイルの設定**

Next.jsからPostgreSQLに接続するには、`my-app/` フォルダに `.env` ファイルを作成します。
まず `.env.example` をコピーして `.env` を作成します。

```
# my-app/.env
DATABASE_URL="postgresql://user:password@postgres:5432/demo"
```

* `user`：DBユーザー名
* `password`：DBパスワード
* `postgres`：ホスト名（Docker ComposeのPostgreSQLサービス名）
* `5432`：ポート番号
* `demo`：データベース名

※ホスト名は `localhost` ではなく `postgres`（Docker Composeのサービス名）を指定します。PHPの設定と同じです。

## Drizzle ORM によるDB接続

Next.jsでは**Drizzle ORM**ライブラリを使ってPostgreSQLに接続します。
接続設定は `my-app/src/lib/db.ts` に記述されています（変更不要）。

```typescript
// my-app/src/lib/db.ts （参考：変更不要）
import { drizzle } from "drizzle-orm/node-postgres";

// ...

dbInstance = drizzle(connectionString);  // .envのDATABASE_URLを使って接続
```

※PHPの `new PDO($dsn, $user, $pass)` に相当します。

---

## SQLの実行方法

**（1）必要なものをimport**

```typescript
import { sql } from "drizzle-orm";
import { db } from "@/lib/db";
```

**（2）SQL文の実行**

```typescript
const result = await db.execute(sql`SELECT * FROM protein`);
```

`` sql`...` `` はテンプレートリテラルを使ったSQLタグです。SQL文をそのまま書けます。
※PHPの `$stmh = $pdo->prepare($sql); $stmh->execute();` に相当します。

**（3）結果の取得**

```typescript
const rows = result.rows;  // 検索結果の配列
```

`result.rows` はオブジェクトの配列です。各要素は列名をキーとして `row.pdbid` のようにアクセスできます。
※PHPの `$stmh->fetchAll(PDO::FETCH_ASSOC)` に相当します。

**（4）型定義（コピペ用）**

TypeScriptでは結果の型を定義しておくと、コード補完が効いて便利です（省略しても動作します）。

```typescript
type MyRow = {
  pdbid: string;
  resolution: number | string | null;
  name: string;
};

const rows = result.rows as MyRow[];
```

**まとめ：DB検索の基本パターン**

```typescript
import { sql } from "drizzle-orm";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

type MyRow = { pdbid: string; name: string; };

async function fetchRows(): Promise<MyRow[]> {
  const result = await db.execute(sql`SELECT pdbid, name FROM protein`);
  return result.rows as MyRow[];
}

export default async function MyPage() {
  const rows = await fetchRows();
  // rowsを使って表示...
}
```
