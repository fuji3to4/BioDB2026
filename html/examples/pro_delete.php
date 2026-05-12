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


if (isset($_GET["id"]) && $_GET["id"] != "") {
        $id = $_GET["id"];
}

if(isset($id)){


	$sql_in="delete from protein where (proteinid = :id)";


	try{

		$stmh=$pdo->prepare($sql_in);

		$stmh->bindvalue(":id","$id",PDO::PARAM_STR);

		$stmh->execute();

		print "[proteinid:{$id}]のレコードを削除しました<br><br>";

	} catch(PDOException $Exception){
		die("エラー:".$Exception->getMessage());

	}
}

##データベース確認+削除する自身のphpへのリンク

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
<tr bgcolor="#00CCCC"><th>proteinid</th><th>Protein Name</th><th>Organism</th><th>Length</th><th></th></tr>
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
	print "</td><td>";
	print "<a href='./pro_delete.php?id=".urlencode((string)($row["proteinid"] ?? ""))."' onclick=\"return confirm('proteinid=".htmlspecialchars((string)($row["proteinid"] ?? ""), ENT_QUOTES)."を削除してもよろしいですか?')\">削除する</a>";
	print "</td><tr>\n";


}



?>
</body>
</html>
