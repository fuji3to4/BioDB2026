# 演習4 補足5 (PHP版): 配列・ループ

> **対象環境:** Docker Compose (PostgreSQL 17 + PHP/Apache + Next.js 15)
> リポジトリをクローンして `docker compose up` で起動できます。

## PHPサンプルプログラム： 配列、繰り返し

値を格納する変数を配列で準備するときは、`array`を使用します。
以下のサンプルは、配列に格納した値を `for` 文を使って表示させるプログラムです。

ファイル名を `sample2.php` として **html/ フォルダ**に保存してください。

```php
<!---- sample2.php ---->
<html>
<head><title>ABCDEFGHI</title></head>
<body>
<?php
  $a = array("ABC", "DEF", "GHI");
  for ($i = 0; $i < 3; $i++) {
    print $a[$i];
    print "<span style='color:#6666ff'>".$a[$i]."</span>";
    print "\n";
    print "<hr width='50' align='left'>\n";
  }
?>
</body>
</html>
<!---- sample2.php end ---->
```

ブラウザで `http://localhost/sample2.php` を開くと、配列の各要素（ABC、DEF、GHI）が通常色と青色で並んで表示されます。

**【解説】**

`$a = array("ABC", "DEF", "GHI");`
$a変数は `array` により `$a[0]`～`$a[2]` の配列が準備され、それぞれに初期値が格納されます。

`for` 文の記述は、C言語とほぼ同じです。

```php
for (初期値の設定; 繰り返し条件; 条件更新式) {
    // ループ内の処理
}
```

* `print $a[$i];`
  $iの値がfor文で0～2まで変化するため、`$a[0]`～`$a[2]` の値を出力します。
* `print "<span style='color:#6666ff'>".$a[$i]."</span>";`
  同じく `$a[$i]` を出力しますが、`<span>` タグのスタイルシートで色をつけて出力しています。
* `print "<hr width='50' align='left'>\n";`
  `<hr>` タグで幅50pxのラインを出力します。
