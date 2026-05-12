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


$proteinid = (isset($_GET['proteinid']) && $_GET['proteinid'] !== "") ? $_GET['proteinid'] : null;

if(isset($proteinid)){


	$sql_in="update protein set fav = fav + 1 where (proteinid = :proteinid)";


	try{

		$stmh=$pdo->prepare($sql_in);

		$stmh->bindValue(":proteinid", $proteinid, PDO::PARAM_STR);

		$stmh->execute();

	} catch(PDOException $Exception){
		die("エラー:".$Exception->getMessage());

	}
}

##データベース確認

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
<tr bgcolor="#00CCCC"><th>proteinid</th><th>Protein Name</th><th>Organism</th><th>Length</th><th>Like</th></tr>
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
	print "<a href='./pro_update.php?proteinid=".urlencode((string)($row["proteinid"] ?? ""))."'>";
	print htmlspecialchars((string)($row["fav"] ?? ""), ENT_QUOTES);
	print "</a>";
	print "</td><tr>\n";


}



?>
</body>
</html>
