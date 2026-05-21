# 演習5 発展3 (Next.js版): SPAの実装

> **対象環境:** Docker Compose (PostgreSQL 17 + PHP/Apache + Next.js 15)
> リポジトリをクローンして `docker compose up` で起動できます。

演習5.2-adv3（発展）では、Next.jsの**Client Component**とServer Actionsを組み合わせて、ページ遷移なしにリアルタイムでデータベース検索を行うSPA（Single Page Application）型の検索Webサイトを構築する。

ex5.2のServer Componentではフォーム送信のたびにページ全体がサーバーから送られてきましたが、SPA版では検索フォームへの入力中に自動で検索結果が更新されます。

例題は <http://localhost:3000/example-spa>（[my-app/src/app/example-spa/](/my-app/src/app/example-spa/)）です。

## 演習5.2-adv3の手順：

(1) 演習環境の **[my-app/src/app/example-spa/](/my-app/src/app/example-spa/)** フォルダのファイル群を確認する。

* `page.tsx`：`"use client"` ディレクティブを持つClient Componentのシェル。Reactの `useState`・`useEffect` でクライアント側の状態を管理する。
* `actions.ts`：Server Actions。`searchPdbAction` がクライアントから呼ばれるたびにサーバー側でDB検索を行う。
* `search-form.tsx`：検索フォームのコンポーネント。
* `search-results-table.tsx`：検索結果テーブルのコンポーネント。
* `client-state.ts`：状態管理のロジックをまとめたファイル。

※Client ComponentとServer Componentの違い：
・Server Component（デフォルト）：サーバーで実行され、`useState`/`useEffect` は使えない。初期データ取得に使う。
・Client Component（`"use client"`）：ブラウザで実行され、インタラクティブな動作が実現できる。

(2) WEBブラウザでアクセスして動作確認する。

<http://localhost:3000/example-spa>

* 検索フォームに文字を入力すると、入力が止まってから少し経つと自動的に検索結果が更新されることを確認する（デバウンス：250ms後に検索実行）。
* 検索結果のPDBIDをクリックすると、ページ遷移なしに詳細情報が表示されることを確認する。

(3) デバウンス検索の仕組みを `page.tsx` で確認する。

* `useEffect` の依存配列に `state.filters` が入っており、フィルターが変わるたびに発火する。
* `setTimeout` で250ms後に `searchPdbAction`（Server Action）を呼び出している。
* 入力中に新しい変更があった場合は `clearTimeout` で前のタイマーをキャンセルする。

(4) 例題を参考に、**自作データベースに対応したSPA型検索ページを作成してください。**

* `my-app/src/app/` 以下に任意のフォルダを作り、`page.tsx`（Client Component）と `actions.ts`（Server Actions）を作成する。
* `actions.ts` に `"use server"`、`page.tsx` の先頭に `"use client"` をそれぞれ記述する。
* 自分のテーブルに合わせて検索フォームと検索結果の表示を変更してください。
