# 演習5 発展2 (PHP版): 詳細ページのリンク

> **対象環境:** Docker Compose (PostgreSQL 17 + PHP/Apache + Next.js 15)
> リポジトリをクローンして `docker compose up` で起動できます。

検索結果の一覧ページから、各エントリの詳細ページへリンクをたどって移動できる「段階的なページ表示」の仕組みを解説します。

---

## １．仕組みの概要

[`search.php`](../../../../html/example/search.php)（一覧ページ）でPDBIDのセルにリンクを貼り、クリックすると [`pdb_detail.php`](../../../../html/example/pdb_detail.php)（詳細ページ）にPDBIDをGETパラメータとして渡します。

```
[ブラウザ]
  ↓ フォームで検索
search.php      ← 検索結果の一覧、各PDBIDはリンク
  ↓ PDBIDリンクをクリック → ?pdbid=1AGW を付けてGET送信
pdb_detail.php  ← PDBIDを受け取って詳細を表示
```

## ２．一覧ページのリンク生成（search.php）

検索結果テーブルのPDBIDセルに、詳細ページへのリンクを埋め込んでいます。

```html
<td>
  <a href="pdb_detail.php?pdbid=<?= urlencode((string)($row['pdbid'] ?? '')) ?>">
    <?= htmlspecialchars((string)($row['pdbid'] ?? ''), ENT_QUOTES) ?>
  </a>
</td>
```

* `urlencode()`：URLに含める値を安全にエンコードする（特殊文字の対処）
* `htmlspecialchars()`：HTML出力時のXSS対策
* リンクをクリックすると `pdb_detail.php?pdbid=1AGW` のようなURLに遷移する

この仕組みを応用すれば、一覧 → 詳細 → さらに詳細 と、多段的にデータをたどることができます。

## ３．詳細ページでのパラメータ受け取り（pdb_detail.php）

GETパラメータ `pdbid` を受け取り、データベースから該当エントリを取得して表示します。

```php
$pdbid = isset($_GET['pdbid']) ? trim($_GET['pdbid']) : '';
if ($pdbid === '') {
    die('pdbid が未指定です。');
}

$row = fetch_pdb_detail($pdbid);
if ($row === null) {
    die('該当するPDBエントリが見つかりません: ' . htmlspecialchars($pdbid, ENT_QUOTES));
}
```

* `$_GET['pdbid']` でURLパラメータ `?pdbid=...` の値を取得
* 値が空・未指定の場合は `die()` でエラー終了
* DBに該当データがない場合もエラー表示

## ４．クォーテーションに関する注意

HTMLの属性値（`href="..."`）はダブルクォーテーションが一般的ですが、シングルクォーテーション（`href='...'`）でも動作します。

PHPの文字列中でダブルクォーテーション（`"`）を使いたい場合はバックスラッシュでエスケープします。

```php
// ダブルクォーテーション文字列中でのエスケープ例
echo "<a href=\"pdb_detail.php?pdbid=1AGW\">1AGW</a>";

// シングルクォーテーションを外側に使えばエスケープ不要
echo '<a href="pdb_detail.php?pdbid=1AGW">1AGW</a>';
```

※ `htmlspecialchars()` と `urlencode()` を使えば安全なURLを簡潔に生成できます（上記の例を推奨）。
