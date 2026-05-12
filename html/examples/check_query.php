<!DOCTYPE html>
<html lang="ja">

<head>
<meta charset="UTF-8">
<title>Search Database</title>
</head>
<body>

<?php

if(empty($_POST["dbname"])||empty($_POST["query"])){
	$db_name = "";
	goto query;
}

$db_user = "user";
$db_pass = "password";
$db_host = "postgres"; #For Docker
#$db_host = "localhost"; #For virtualBox
$db_name = $_POST["dbname"];

$dsn="postgres:host={$db_host};dbname={$db_name};charset=utf8";

try{
        $pdo = new PDO($dsn,$db_user,$db_pass);

        $pdo->setAttribute(PDO::ATTR_ERRMODE,PDO::ERRMODE_EXCEPTION);
        $pdo->setAttribute(PDO::ATTR_EMULATE_PREPARES,false);

} catch(PDOException $Exception){
        die("DB接続エラー:".$Exception->getMessage());

}

$sql = $_POST["query"];

print "$sql</br></br>";

try{
	$stmh=$pdo->prepare($sql);
	$stmh->execute();
} catch(PDOException $Exception){
		print("DB検索エラー:".$Exception->getMessage());
		goto query;
}

$result=$stmh->fetchAll(PDO::FETCH_ASSOC);


print "<table border='1' cellpadding='2' cellspacing='0'><thead><tr bgcolor='#00CCCC'>";

foreach(array_keys($result[0]) as $f){
	print "<th>".htmlspecialchars($f,ENT_QUOTES)."</th>";
}
print "</tr></thead><tbody>";



foreach($result as $row) {
		print "<tr>";

	foreach(array_keys($row) as $f){
		print "<td>";
		print htmlspecialchars((string)($row[$f] ?? ""), ENT_QUOTES);
		print "</td>";
	}
		print  "</tr>";
}

print "</tbody></table><br>";

query:
?>


<form action="./check_query.php" method="POST"> 

<p>DBname:</br>
      <input type="text" name="dbname" value="<?=$db_name?>" size="10">
</p>
<p>Query:</br>
      <textarea name="query" cols="40" rows="8"></textarea>
</p>
<input type="submit" value="search">
</form>

</body>
</html>

