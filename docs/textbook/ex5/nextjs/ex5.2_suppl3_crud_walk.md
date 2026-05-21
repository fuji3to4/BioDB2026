# 演習5 補足3 (Next.js版): CRUDコードの解説

> **対象環境:** Docker Compose (PostgreSQL 17 + PHP/Apache + Next.js 15)
> リポジトリをクローンして `docker compose up` で起動できます。

ここでは `my-app/src/app/example/proteins/` フォルダ（タンパク質の登録・削除・お気に入り操作）と
`example/pdb/[pdbid]/`（詳細ページ）の実装を解説します。
検索ページ（[example/page.tsx](/my-app/src/app/example/page.tsx)）の解説は別ページを参照してください。

---

## １．フォルダ構成

```
my-app/src/app/example/
  page.tsx                     ← PDB検索ページ（別ページ参照）
  pdb/
    [pdbid]/
      page.tsx                ← PDB詳細ページ（動的ルート）
  proteins/
    page.tsx                  ← タンパク質一覧 + CRUD
    actions.ts                ← Server Actions（作成・削除・Fav+1）
    protein-create-form.tsx   ← 入力フォーム（Client Component）
    delete-protein-dialog.tsx ← 削除確認ダイアログ（Client Component）
```

---

## ２．pdb/[pdbid]/page.tsx（詳細ページ）

URLが `/example/pdb/1ABC` のとき、`[pdbid]` フォルダが `pdbid = "1ABC"` として動作します（動的ルート）。

```typescript
type DetailProps = {
  params: Promise<{ pdbid: string }>; // URLの[pdbid]部分
};

export default async function PdbDetailPage({ params }: DetailProps) {
  const { pdbid } = await params;     // ① URLから pdbid を取得
  const detail = await fetchPdbDetail(pdbid); // ② DBから1件取得

  if (!detail) notFound();           // ③ 見つからなければ404

  return (
    <main>
      <h1>{detail.pdbid}</h1>
      <Image src={`/pic/${detail.pdbid.toLowerCase()}.jpeg`} ... />
    </main>
  );
}
```

* `params` は Next.js 15 では `Promise` なので `await params` が必要
* `notFound()` を呼ぶと Next.js が自動的に 404 ページを表示する
* `Image`（next/image）は `<img>` の最適化版。`width/height` 指定が必要

---

## ３．proteins/page.tsx（一覧ページ）

タンパク質の一覧表示と各種操作を1ページにまとめたServer Componentです。

```tsx
export const dynamic = "force-dynamic"; // 毎回DBから取得

export default async function ProteinsPage() {
  const proteins = await fetchProteins(); // 全件取得

  return (
    <main>
      <ProteinCreateForm />                            {/* 追加フォーム */}
      <table>
        {proteins.map((protein) => (
          <tr key={protein.proteinid}>
            <td>{protein.name}</td>
            <td>
              <form action={incrementProteinFavAction.bind(null, protein.proteinid)}>
                <button type="submit">+1 Fav</button>
              </form>
            </td>
            <td><DeleteProteinDialog proteinId={protein.proteinid} ... /></td>
          </tr>
        ))}
      </table>
    </main>
  );
}
```

* Server Component なのでコンポーネント関数自体に `async` が付き、ページ描画前にDBを取得できる
* `incrementProteinFavAction.bind(null, protein.proteinid)`：Server Action に引数をあらかじめバインドするパターン。クリックで特定のIDに +1 Fav が送信される
* `ProteinCreateForm` と `DeleteProteinDialog` はClient Component（後述）として別ファイルに分離している

---

## ４．proteins/actions.ts（Server Actions）

ファイル先頭の `"use server"` でこのファイル内の全関数が Server Action になります。

```typescript
"use server";

import { revalidatePath } from "next/cache";

export async function createProteinAction(_, formData: FormData) {
  try {
    const input = validateProteinInput(formData); // バリデーション
    await createProtein(input);                   // INSERT
    revalidatePath("/example/proteins");          // ページを再検証
    return { error: null };                       // 成功
  } catch (error) {
    return { error: error.message };              // エラーメッセージを返す
  }
}

export async function incrementProteinFavAction(proteinId: number) {
  await incrementProteinFav(proteinId);           // UPDATE fav+1
  revalidatePath("/example/proteins");            // ページを再検証
}

export async function deleteProteinAction(proteinId: number) {
  await deleteProtein(proteinId);                 // DELETE
  revalidatePath("/example/proteins");            // ページを再検証
}
```

* **revalidatePath**：DBを更新した後にこれを呼ぶと、Next.jsが該当URLのキャッシュを破棄して次回アクセス時に最新データを取得する。PHPでは毎回DBを読み直すのが自然だが、Next.jsではキャッシュを明示的に無効化する必要がある
* `createProteinAction(_, formData)` の第1引数 `_`：`useActionState` が渡す「前回の状態」。この関数では使わないが、引数の位置を合わせるために必要
* Server Action は必ず `async` 関数

---

## ５．proteins/protein-create-form.tsx（入力フォーム）

フォーム送信と状態管理を行うClient Componentです。`useActionState` と `useFormStatus` を使います。

```tsx
"use client";

import { useActionState, useEffect, useRef } from "react";
import { useFormStatus } from "react-dom";

function SubmitButton() {
  const { pending } = useFormStatus();        // 送信中かどうかを検知
  return <button>{pending ? "Creating..." : "Create protein"}</button>;
}

export function ProteinCreateForm() {
  // useActionState: Actionの戻り値をstateとして受け取る
  const [state, formAction] = useActionState(createProteinAction, { error: null });
  const formRef = useRef<HTMLFormElement>(null);
  const submittedRef = useRef(false);

  // 成功したらフォームをリセット
  useEffect(() => {
    if (submittedRef.current && state.error === null) {
      formRef.current?.reset();
      submittedRef.current = false;
    }
  }, [state.error]);

  return (
    <form ref={formRef} action={formAction}
      onSubmit={() => { submittedRef.current = true; }}>
      <input name="name" required />
      <input name="org" required />
      <input name="len" type="number" min="1" required />
      {state.error ? <p>{state.error}</p> : null} {/* エラー表示 */}
      <SubmitButton />
    </form>
  );
}
```

* **useActionState(action, initialState)**：Server Actionの戻り値（`{ error: ... }`）を `state` として受け取るフック。`formAction` を `form` の `action` に渡す
* **useFormStatus()**：`<form>` 内で使うと送信中（`pending`）を検知できる。`SubmitButton` として別コンポーネントに分離しているのはこのフックの仕様上の要件（親formコンポーネント内では使えない）
* **useRef**：2つの用途。`formRef` は `form` DOM要素の参照（`reset()` 呼び出し用）。`submittedRef` はフォーム送信済みフラグ（再レンダリングをまたいで値を保持するが、変化してもレンダリングを起こさない）
* **useEffect**：`state.error` が `null`（成功）かつ送信済みのとき → フォームをリセット。初期表示時に誤ってリセットしないよう `submittedRef` で制御している

---

## ６．proteins/delete-protein-dialog.tsx（削除確認ダイアログ）

削除は取り消せない操作なので、確認ダイアログを挟みます。`AlertDialog` は shadcn/ui コンポーネントです。

```tsx
"use client";

import { AlertDialog, AlertDialogTrigger,
         AlertDialogContent, AlertDialogFooter,
         AlertDialogAction, AlertDialogCancel } from "@/components/ui/alert-dialog";

export function DeleteProteinDialog({ proteinId, deleteAction }) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <button>Delete</button>                    {/* ① このボタンでダイアログ表示 */}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <p>Delete this protein?</p>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={() => deleteAction(proteinId)}>
            Delete                                     {/* ② 確認後にServer Action呼び出し */}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
```

* `AlertDialogTrigger asChild`：内側の `<button>` をトリガーとして使う（shadcn/ui のパターン）
* `AlertDialogAction onClick`：確認ボタンを押したときに `deleteAction(proteinId)`（Server Action）を直接呼び出す
* Server Action はブラウザから呼べる非同期関数として振る舞うため、`onClick` から直接呼び出せる

---

## ７．[src/lib/proteins.ts](/my-app/src/lib/proteins.ts) の SQL（CRUD操作）

4種類のCRUD操作をすべて確認します。

```typescript
// READ：全件取得
export async function fetchProteins() {
  const result = await db.execute(sql`
    select proteinid, name, organism, len, fav
    from protein
    order by proteinid
  `);
  return result.rows as ProteinRow[];
}

// CREATE：1件追加
export async function createProtein(input: ProteinInput) {
  await db.execute(sql`
    insert into protein(name, organism, len, fav)
    values (${input.name}, ${input.organism}, ${input.length}, 0)
  `);
}

// UPDATE：fav を +1
export async function incrementProteinFav(proteinId: number) {
  await db.execute(sql`
    update protein
    set fav = fav + 1
    where proteinid = ${proteinId}
  `);
}

// DELETE：1件削除
export async function deleteProtein(proteinId: number) {
  await db.execute(sql`
    delete from protein
    where proteinid = ${proteinId}
  `);
}
```

* `insert into protein(...) values (${...})`：`${}` で変数を埋め込む → SQLインジェクション対策済み
* `set fav = fav + 1`：現在の値に1を加算するSQL。JavaScriptで値を読んでから書くより安全（競合しない）
* `result.rows as ProteinRow[]`：TypeScriptの型アサーション。DBの実行結果を型付きに変換

---

## ８．@/lib/protein-form.ts（入力バリデーション）

フォームデータのバリデーションを専用ファイルに分離しています。

```typescript
export function validateProteinInput(formData: FormData): ProteinInput {
  const name = readRequiredText(formData, "name", "Protein name");
  const organism = readRequiredText(formData, "org", "Organism");
  const length = Number(formData.get("len"));

  if (!Number.isInteger(length) || length <= 0) {
    throw new Error("Length must be a positive integer");
  }
  return { name, organism, length };
}

function readRequiredText(formData, key, label) {
  const value = formData.get(key);
  const text = typeof value === "string" ? value.trim() : "";
  if (!text) throw new Error(`${label} is required`);
  return text;
}
```

* `formData.get("name")`：HTMLフォームの `name="name"` の値を取得（PHPの `$_POST["name"]` に相当）
* エラーがあれば `throw` → `actions.ts` の `catch` で捕捉 → `{ error: message }` を返す → フォームに表示される
* バリデーションをActionから分離することで、テストしやすい設計になっている

---

## データフロー（まとめ）

```
【追加】
ユーザー入力 → ProteinCreateForm (Client)
  → createProteinAction (Server Action)
    → validateProteinInput → createProtein (INSERT)
    → revalidatePath → ページ再描画（新しい一覧を表示）

【Fav+1】
ボタンクリック → form action=incrementProteinFavAction.bind(id)
  → Server Action → incrementProteinFav (UPDATE fav+1)
  → revalidatePath → ページ再描画

【削除】
DeleteProteinDialog (Client) → ダイアログ表示
  → 確認ボタン onClick → deleteProteinAction (Server Action)
    → deleteProtein (DELETE) → revalidatePath → ページ再描画
```

※いずれの操作も `revalidatePath` によってページキャッシュが破棄され、最新のDB状態が表示されます。
PHPでは毎リクエストごとにDBを読み直すのが自然ですが、Next.jsではキャッシュの明示的な無効化が重要です。
