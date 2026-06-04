# 演習4 (Next.js版): Webデータベース検索インターフェイスの作成

> **対象環境:** Docker Compose (PostgreSQL 17 + PHP/Apache + Next.js 15)
> リポジトリをクローンして `docker compose up` で起動できます。

演習4.2では、データベースを検索し出力をWeb上に表示するNext.jsプログラムを作成する。

Next.jsではReactの**Server Component**という仕組みを使うことで、サーバー側でデータベースを検索してHTMLを生成することができます。

## 演習4.2の手順：

例題は [`my-app/src/app/search-pdb-simple/page.tsx`](/my-app/src/app/search-pdb-simple/page.tsx) です。
`demo`データベースから3つのテーブルを繋ぎ合わせ、PDBID・Resolution・Protein name・Organismの列を取り出して表示させるプログラムです。

(1)**nextjsコンテナ**は開発コンテナとして用意されています。VS Code Remote / Dev Containers で実行中の nextjs コンテナに接続し、`/app` で作業してください。

※VScodeの拡張機能で「Docker」開発支援が必要。参考: VScodeの利用

もしくは**nextjsコンテナ**に接続し、開発サーバーにbashで接続してもよい。

```bash
docker compose exec -it nextjs bash
```

初めてNext.js起動するときに、コンテナ内で以下を行う：

```bash
cp .env.example .env
npm install
```

(2) 演習環境の [`my-app/src/app/search-pdb-simple/page.tsx`](/my-app/src/app/search-pdb-simple/page.tsx) を確認してください。

コードのポイント：

* `export const dynamic = "force-dynamic"`：アクセスのたびにサーバー側でDBを検索して最新データを返す設定
* `` db.execute(sql`...`) ``：Drizzle ORM を使ったSQL実行
* 関数に `async` が付いており、コンポーネント自体がデータを取得できるのがServer Componentの特徴

next.js開発サーバーを起動

```bash
npm run dev
```

もしくは、ビルドして起動

```bash
npm run build
npm start
```

※`npm run dev`は開発用にNext.jsを起動させます。アクセスする度にコードの変更が反映されるため、開発中はこのコマンドを実行したままで大丈夫です。ただしコンパイルが毎回入るので若干重くなります。

ビルドして起動させるコマンドは、一度ビルドしてしまえば、コードの変更があっても再度ビルドしない限り反映されないため、ウェブアプリを軽く動かすことができます。

(3) WEBブラウザを起動し、URL入力欄に以下のURLを入力してEnterキーを押し、実行結果を確認する。

```
http://localhost:3000/search-pdb-simple
```

(4) 例題の出力を確認したら、**自作したデータベースを検索する新しいページを作成し、動作確認をしてください。**

* `my-app/src/app/` 以下に任意の名前でフォルダを作り、`page.tsx` を作成する。
  例：`my-app/src/app/my-search/page.tsx`
* SQLは `` db.execute(sql`SELECT ... FROM ...`) `` の形式で記述する。
* 自分のデータベース名に合わせて `.env` に

  ```
  MY_DATABASE_URL=postgresql://user:password@localhost:5432/{自分のデータベース名}
  ```

  を追記する。
* データベース接続用lib `my-app/src/lib/db.ts` をコピーして `my-app/src/lib/mydb.ts` を作成する。`process.env.DATABASE_URL` を `process.env.MY_DATABASE_URL` に変更する。
* `page.tsx` 冒頭のlibの呼び出しを `@/lib/mydb` に修正する。

  ```typescript
  import { db } from "@/lib/mydb";
  ```

開発サーバーが起動しっぱしだった場合はCtrl+cで一旦停止して、再び起動する。

```bash
npm run dev
```

※基本的には `npm run dev` 中はコードを変更するとブラウザがホットリロードされて自動反映されますが、`.env` を編集した場合など運なく反映されないことがあるため。

以下のURLにブラウザからアクセスします。

```
http://localhost:3000/my-search
```
