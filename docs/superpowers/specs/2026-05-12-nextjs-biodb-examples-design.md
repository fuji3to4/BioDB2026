# Next.js BioDB Examples Design

## Problem

`html\examples` にある PHP ベースの教材用機能を、`my-app\src` 配下の Next.js App Router 実装へ移し替える。API Route は使わず、サーバー側の取得処理と Server Actions で完結させる。既存の `my-app\src` 実装は引き継がず、機能対応を優先して再構成する。

対象に含める機能:

- PDB 検索フォームと結果表示
- 検索結果からの PDB 詳細遷移
- Protein 一覧表示
- Protein 追加
- Protein fav 加算
- Protein 削除

対象外:

- `check_query.php` のような任意 SQL 実行 UI
- PHP 版と同一の見た目の再現

## Goals

1. `html\examples` の主要機能を Next.js で一通り操作できること
2. API Route を増やさず、Server Components / Server Actions で完結すること
3. 検索、詳細、管理の導線が明確であること
4. 画像は既存の `my-app\public` 配下を利用すること

## High-Level Approach

App Router の複数ページ構成を採用する。

- `/` を PDB 検索ページ
- `/pdb/[pdbid]` を PDB 詳細ページ
- `/proteins` を Protein 管理ページ

検索は URL クエリを使ってサーバーで実行し、状態共有しやすい形にする。更新系は Server Action に集約し、成功後に `revalidatePath` で該当ページを再描画する。React らしい UX は必要箇所だけ小さな Client Component で補強するが、基本はサーバー主導にする。

## Route Design

### `/`

役割:

- `search_form.html`
- `search_form_bs.html`
- `search_get.php`
- `search_get_with_link.php`
- `search_get_with_link_bs.php`

に相当する検索 UI と結果一覧を 1 ページに統合する。

表示内容:

- PDBID
- Protein Name
- Organism
- Resolution upper bound
- Class セレクト
- 検索結果件数
- 結果テーブル
- PDB 詳細へのリンク

振る舞い:

- フォーム送信は GET
- 空欄はワイルドカード相当として扱う
- `resolution` は入力があるときだけ上限条件に加える
- 検索条件は URL に反映し、再読込・共有に耐える

### `/pdb/[pdbid]`

役割:

- `link2pdb.php`
- `link2pdb_bs.php`

に相当する PDB 詳細表示。

表示内容:

- PDBID
- Protein 名
- Organism
- Protein length
- PDB method / resolution / chain / positions / deposited / class
- 外部 PDB URL
- `public` 配下の画像

振る舞い:

- `pdbid` をキーにサーバーで 1 件取得
- 対象がなければ `notFound()` 相当で処理
- 解像度は必要なら小数点整形して表示

### `/proteins`

役割:

- `pro_show.php`
- `pro_insert_form.html`
- `pro_insert.php`
- `pro_update.php`
- `pro_delete.php`

に相当する Protein 管理画面。

表示内容:

- Protein 追加フォーム
- Protein 一覧テーブル
- fav 値
- 削除操作

振る舞い:

- 追加、fav 加算、削除はすべて Server Action
- 追加成功後は同ページを再検証して一覧更新
- fav はワンクリックで加算
- 削除は誤操作防止の確認 UI を入れる

## Data Access Design

DB アクセスは `src\lib` 配下にまとめ、ページと Action から直接 SQL を書かない。

想定モジュール:

- `src\lib\db.ts`: 接続プール
- `src\lib\queries\pdb.ts`: 検索一覧と詳細取得
- `src\lib\queries\proteins.ts`: 一覧、追加、fav 加算、削除

方針:

- SQL は既存 PHP と同等の条件を保つ
- プレースホルダを使い、文字列連結で条件を埋め込まない
- 画面が必要とする単位で関数を分ける
- UI 層は取得済みデータと Action の結果だけを扱う

## Server Action Design

想定 Action:

- `createProteinAction(formData)`
- `incrementProteinFavAction(proteinId)`
- `deleteProteinAction(proteinId)`

共通方針:

- 入力検証はサーバー側で行う
- 成功後は `revalidatePath("/proteins")`
- 失敗時はページ内にエラーメッセージを返す
- サイレント失敗はしない

検索は URL クエリ主体のため Server Action ではなくページのサーバーレンダリングで処理する。

## Component Boundaries

基本は Server Components とし、Client Component は次に限定する。

- 削除確認 UI
- 送信中表示
- 必要なら fav 更新の操作感向上

これにより、データ整合性はサーバー主導のまま保ちつつ、局所的に React らしい UX を加えられる。

## Error Handling

- DB 接続やクエリエラーはユーザー向けメッセージとして表示し、デバッグ用にはサーバーログに残す
- 追加フォームの必須項目不足は項目単位またはフォーム上部で表示
- 存在しない `pdbid` は 404 扱い
- 数値項目に不正値が来た場合は明示的に弾く

## UX Notes

- トップページと Protein 管理ページの相互リンクをヘッダに置く
- 検索条件と結果は同一画面にまとめ、往復を減らす
- 一覧テーブルは PHP 版より読みやすい余白と見出しを持たせる
- 見た目はモダンに整理してよいが、元機能との対応が分かる構成にする

## Testing Strategy

実装時の確認観点:

1. 検索条件の有無で SQL 条件が正しく切り替わる
2. 検索結果から詳細ページへ遷移できる
3. 詳細ページで DB 情報、外部リンク、画像が表示される
4. Protein 追加で一覧に反映される
5. fav 加算で数値が更新される
6. 削除で一覧から消える
7. API Route を使わずに要件が満たされている

## Implementation Notes

- 既存の `src\app\api\...` は削除対象
- 既存の `src\app\page.tsx` なども今回の画面構成に合わせて置き換える
- `public` 配下の既存画像資産はそのまま利用する
- Tailwind は既存依存を使ってよいが、必須ではなく、実装しやすい方法を優先する

## Out of Scope

- 任意 SQL 実行機能
- 認証・認可
- 既存 PHP の Bootstrap デザイン完全再現
- 検索結果の高度な並び替えやページネーション
