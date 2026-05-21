# 演習5 発展1 (Next.js版): CRUDの実装

> **対象環境:** Docker Compose (PostgreSQL 17 + PHP/Apache + Next.js 15)
> リポジトリをクローンして `docker compose up` で起動できます。

演習5.2-adv1（発展）では、Next.jsの**Server Actions**を使ってデータの追加・削除を行うCRUD操作を実装する。

Server Actionsとは、Next.jsでサーバー側の処理（DB書き込みなど）を関数として定義し、クライアントから呼び出せる仕組みです。

例題は <http://localhost:3000/example/proteins>（`my-app/src/app/example/proteins/`）です。

## 演習5.2-adv1の手順：

(1) 演習環境の **my-app/src/app/example/proteins/** フォルダのファイル群を確認する。

* [`page.tsx`](../../../../my-app/src/app/example/page.tsx)：タンパク質一覧の表示と削除・Favボタン（Server Component）
* `actions.ts`：`"use server"` ディレクティブを持つServer Actions。`deleteProteinAction`・`incrementProteinFavAction` などのDB書き込み処理を定義。
* `protein-create-form.tsx`：データ追加フォーム（Client Component）
* `delete-protein-dialog.tsx`：削除確認ダイアログ（Client Component）

※`actions.ts` の冒頭に `"use server"` があることで、サーバー側で実行されるServer Actionになります。クライアントから直接呼び出せますが、処理はサーバーで行われます。

(2) WEBブラウザでアクセスして動作確認する。

<http://localhost:3000/example/proteins>

* フォームにProtein Name・Organism・Lengthを入力して「Add Protein」ボタンを押し、一覧にデータが追加されることを確認する。
* 「Delete」ボタンを押して確認ダイアログを経てデータが削除されることを確認する。
* 「+1 Fav」ボタンを押して、Favカウントが増加することを確認する。

(3) ダイナミックルーティングの例として、`my-app/src/app/example/pdb/[pdbid]/page.tsx` も確認してみてください。

* フォルダ名の `[pdbid]` がURLのパラメータに対応している。
* `/example/pdb/1AGW` にアクセスすると、`params.pdbid` に `"1AGW"` が渡される。

(4) 例題を参考に、**自作データベースに対応したCRUDページを作成してください。**

* `my-app/src/app/` 以下に任意のフォルダを作り、`page.tsx` と `actions.ts` を作成する。
* `actions.ts` に `"use server"` を記述し、INSERT・DELETE処理をServer Actionとして定義する。
* 自分のテーブルの列に合わせてフォームとSQL文を変更してください。
