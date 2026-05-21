# 演習4 補足4 (PHP版): Hello World

> **対象環境:** Docker Compose (PostgreSQL 17 + PHP/Apache + Next.js 15)
> リポジトリをクローンして `docker compose up` で起動できます。

## PHPサンプルプログラム： Hello World!

まず最初に、簡単なプログラムを作って動かしてみます。
以下は「Hello World!」という見出しを出力するプログラムです。

HTML形式で書くときは、以下のようなソースになります。
ファイル名を `sample1.html` として、リポジトリルートの **html/ フォルダ**に保存してください。

```html
<!---- sample1.html ---->
<html>
<head>
<title>Hello World!</title>
</head>
<body>
<h1 style='color:#ff00ff'>Hello World!</h1>
</body>
</html>
<!---- sample1.html end ---->
```

ファイルを保存したら、WEBブラウザで以下のURLにアクセスします。

```
http://localhost/sample1.html
```

マゼンタ色の見出しで「Hello World!」と表示されていると思います。

次に、このHTMLと同じ出力結果が出るように、PHPソースを作ってみます。
ファイル名を `sample1.php` として、同じく **html/ フォルダ**に保存します。

```php
<!---- sample1.php ---->
<html>
<?php
  $a="Hello World!";
  print "<head>\n";
  print "<title>".$a."</title>\n";
  print "</head>\n";
  print "<body>\n";
  print "<h1 style='color:#ff00ff'>".$a."</h1>\n";
  print "</body>\n";
?>
</html>
<!---- sample1.php end ---->
```

ファイルを保存したら、WEBブラウザで以下のURLにアクセスします。

```
http://localhost/sample1.php
```

マゼンタ色の見出しで「Hello World!」と表示されていると思います。

※PHPはWEBサーバーを介していないと動作しません。必ずWEBブラウザを通してURLからアクセスしてください（ファイルをダブルクリックして開いても動作しません）。

もし、エラーが出ている場合は、PHPの記述ミスが存在しています。

PHPのソースは、HTMLのソースに「モード切り替え記号」を使ってスクリプトを挿入します。`<?php` から始まって、`?>` で終わる部分がPHPのソースとなります。

**【解説】**

```php
<?php                                      // ← モード切り替え開始
$a="Hello World!";                         // ← $aという変数に文字列"Hello World!"を代入
print "<head>\n";                          // ← print関数を使ってHTMLスクリプトを書き出す
print "<title>".$a."</title>\n";           // ← 文字列を「.」（ドット）で連結して書き出す
print "</head>\n";
print "<body>\n";
print "<h1 style='color:#ff00ff'>".$a."</h1>\n";
print "</body>\n";
?>                                         // ← モード切り替え終了
```

`<?php` / `?>` はモード切り替え開始・終了を表し、`print` 関数を使ってHTMLスクリプトを出力させています。
クライアント（WEBブラウザ）は、PHPプログラムエンジンが出力した値を反映します。

最初に作った `sample1.html` と `sample1.php` を比べると、サーバ側ではソースが異なりますが、クライアント（WEBブラウザ）側では、サーバが返した結果を反映するため、表示が同じになります。
