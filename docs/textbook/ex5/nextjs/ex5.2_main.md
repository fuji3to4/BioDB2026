# 演習5 (Next.js版): データベース操作Webアプリの完成

> **対象環境:** Docker Compose (PostgreSQL 17 + PHP/Apache + Next.js 15)
> リポジトリをクローンして `docker compose up` で起動できます。

演習5.2ではNext.jsのServer Componentを使ってデータベース検索WEBサイトを構築する。

以下の流れで、まず例題（<http://localhost:3000/example>）を動作確認してから、自作のWebサイトの構築を行ってください。

1. `searchParams`で受け取った引数を検索条件としてデータベース検索し、結果を動的に表示するServer Componentページを作成する。
2. GETメソッドのHTMLフォームと組み合わせてデータベース検索Webサイトとして完成させる。
3. 自分で作成したデータベースを使って、データベースを検索し表示させるWebサイトを構築する。

## 演習5.2の手順：

(0) **nextjsコンテナ**で開発サーバーが起動していることを確認する（まだの場合は起動する）。

```bash
docker compose exec -it nextjs bash
```

コンテナ内で：

```bash
npm run dev
```

(1) 演習環境の **[my-app/src/app/example/page.tsx](/my-app/src/app/example/page.tsx)** を確認する。

コードのポイント：

* `searchParams`：URLのクエリパラメータ（`?id=1AGW` 等）を受け取るNext.jsの仕組み。
* フォームの `method="get"` により、検索ボタンを押すとURLにパラメータが付いてページが再読み込みされる。
* Server Componentのためフォーム送信もURLアクセスもサーバー側でDBを検索して結果を返す。

(2) WEBブラウザを起動し、URL入力欄に以下のURLを入力してEnterキーを押し、実行結果を確認する。

<http://localhost:3000/example>

(3) URLパラメータを以下の例のようにいろいろ入力してみて、検索結果が動的に変化することを確認してください。

<http://localhost:3000/example?id=1AGW>

<http://localhost:3000/example?res=2.5>

<http://localhost:3000/example?org=Human&res=2.5>

(4) 例題の出力を確認したら、**自作したデータベースを検索するNext.jsページを作成してください。**

* `my-app/src/app/` 以下に任意の名前でフォルダを作り、`page.tsx` を作成する。
* まずは例題を自作データベースに変更するところから始めてみてください。
* `DATABASE_URL`（`.env`ファイル）のデータベース名（`/demo` の部分）を自分のDBに変更してください。
* ※コードを変更するとブラウザがホットリロードされて自動反映されます（`npm run dev` 実行中）。
