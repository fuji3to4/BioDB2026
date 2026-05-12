<?php
header('Content-Type:text/html; charset=UTF-8');
?>
<!DOCTYPE html>
<html lang="ja">

<head>
<meta charset="UTF-8">
<title>result</title>
</head>

<body>
<?php
require('connectdb.php');

if (isset($_GET["name"]) && $_GET["name"] != "") {
        $name = $_GET["name"];
}
else {
        die("nameが未入力です。");
}

if (isset($_GET["org"]) && $_GET["org"] != "") {
        $org = $_GET["org"];
}
else {
        die("orgが未入力です。");
}


if (isset($_GET["len"]) && $_GET["len"] != "") {
        $len = $_GET["len"];
}
else {
        die("lenが未入力です。");
}



$sql_in="insert into protein(name,organism,len,fav) values (:name,:org,:len,0)"; 
#idはauto_increment(自動番号付け)のため指定しなくてよい。
#favは初期値を指定しなければならない。今回の表示に関係しないがテーブルに存在している属性は指定しなければならない。


try{

        $stmh=$pdo->prepare($sql_in);

        $stmh->bindValue(":name","$name",PDO::PARAM_STR);
        $stmh->bindValue(":org","$org",PDO::PARAM_STR);
        $stmh->bindValue(":len","$len",PDO::PARAM_STR);


        $stmh->execute();

        $count=$stmh->rowCount();

        print "データを{$count}件追加しました。<br><br>";

} catch(PDOException $Exception){
        die("エラー:".$Exception->getMessage());

}


##proteinテーブル確認

try{
        $sql = "select * from protein";
        
        $stmh=$pdo->prepare($sql);
        $stmh->execute();

} catch(PDOException $Exception){
        die("DB検索エラー:".$Exception->getMessage());

}
?>

<table border='1' cellpadding='2' cellspacing='0'>
<thead>
<tr bgcolor="#00CCCC"><th>proteinid</th><th>Protein Name</th><th>Organism</th><th>Length</th></tr>
</thead>
<tbody>

<?php


$result=$stmh->fetchAll(PDO::FETCH_ASSOC);

foreach($result as $row){
        print "<tr><td>"; 
        print htmlspecialchars((string)($row["proteinid"] ?? ""), ENT_QUOTES);
        print "</td><td>";
        print htmlspecialchars((string)($row["name"] ?? ""), ENT_QUOTES);
        print "</td><td>";
        print htmlspecialchars((string)($row["organism"] ?? ""), ENT_QUOTES);
        print "</td><td>";
        print htmlspecialchars((string)($row["len"] ?? ""), ENT_QUOTES);
        print "</td><tr>\n";
        

}



?>
</body>
</html>
