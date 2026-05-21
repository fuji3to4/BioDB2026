# 演習5 発展1 (PHP版): CRUDの実装

> **対象環境:** Docker Compose (PostgreSQL 17 + PHP/Apache + Next.js 15)
> リポジトリをクローンして `docker compose up` で起動できます。

演習5.1-adv1（発展）では、PHPを使ってデータの追加・削除・更新を行うCRUD操作を実装する。

**CRUD**とは Create（作成）・Read（読み取り）・Update（更新）・Delete（削除）の頭文字をとったもので、Webアプリケーションの基本操作です。

例題は [`html/example/proteins.php`](/html/example/proteins.php) です。

## 演習5.1-adv1の手順：

(1) 演習環境の **[`html/example/proteins.php`](/html/example/proteins.php)** を確認する。

コードのポイント：

* **PRGパターン（Post-Redirect-Get）**：POSTリクエストでデータを更新した後、`header('Location: proteins.php')` でリダイレクトすることで、ブラウザの更新ボタンによる二重送信を防ぐ。
* `$_POST['action']` の値（`create`/`delete`/`fav`）によって処理を分岐している。
* フォームの `<input type="hidden" name="action" value="create">` でアクションを送信している。

(2) WEBブラウザでアクセスして動作確認する。

```
http://localhost/example/proteins.php
```

* フォームにProtein Name・Organism・Lengthを入力して「Add」ボタンを押し、一覧にデータが追加されることを確認する。
* 「Delete」ボタンを押して、データが削除されることを確認する。
* 「★ Fav」ボタンを押して、Favカウントが増加することを確認する。

(3) 例題を参考に、**自作データベースに対応したCRUDプログラムを `./html/` に作成してください。**

* 自分のテーブルの列に合わせてフォームとSQL文を変更してください。
* INSERT文・DELETE文を使ってデータを追加・削除できるようにしてください。
* ※[`html/example/lib/protein_queries.php`](/html/example/lib/protein_queries.php) も合わせて確認してください。DB操作を関数として分離している例です。
