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

$id = (isset($_GET['id']) && $_GET['id'] !== "") ? $_GET['id'] : "%";
$name = (isset($_GET['name']) && $_GET['name'] !== "") ? $_GET['name'] : "%";
$class = (isset($_GET['class']) && $_GET['class'] !== "") ? $_GET['class'] : "%";
$org = (isset($_GET['org']) && $_GET['org'] !== "") ? $_GET['org'] : "%";

// $res だけ特別扱いする
$res = (isset($_GET['res']) && $_GET['res'] !== "") ? $_GET['res'] : null;

 

$sql = "
select pdb.pdbid, pdb.method, pdb.resolution, pdb.class, protein.name, protein.organism
from pdb natural join pdb2protein natural join protein
where (pdb.pdbid like :id)
and (pdb.class like :class) 
and (protein.name like :name) 
and (protein.organism like :org) 
";


// resolution指定がある場合、条件を追加
if ($res !== null) {
		$sql .= " AND (pdb.resolution <= :res)";
}


try{

        $stmh=$pdo->prepare($sql);

		$stmh->bindValue(":id","%{$id}%",PDO::PARAM_STR);
        $stmh->bindValue(":class","%{$class}%",PDO::PARAM_STR);
		$stmh->bindValue(":name","%{$name}%",PDO::PARAM_STR);
		$stmh->bindValue(":org","%{$org}%",PDO::PARAM_STR);

        if(isset($res)) {
                $stmh->bindValue(":res","$res",PDO::PARAM_INT);
        }
	
        $stmh->execute();

        $count=$stmh->rowCount();

        print "検索結果は{$count}件です。<br><br>";

} catch(PDOException $Exception){
        die("DB検索エラー:".$Exception->getMessage());

}

?>

<table border='1' cellpadding='2' cellspacing='0'>
<thead>
<tr bgcolor="#00CCCC"><th>PDBID</th><th>Method</th><th>Resolution</th><th>Class</th><th>Protein Name</th><th>Organism</th></tr>
</thead>
<tbody>

<?php
 
$result=$stmh->fetchAll(PDO::FETCH_ASSOC);

foreach($result as $row) {
	print "<tr><td>";

	/*search_get.phpとここだけ異なる
	<a>タグを入れてリンクを貼っている*/
	print "<a href='./link2pdb.php?pdbid=".urlencode((string)($row["pdbid"] ?? ""))."'>";
	print htmlspecialchars((string)($row["pdbid"] ?? ""), ENT_QUOTES);
	print "</a>";
	//

	print "</td><td>";
    print htmlspecialchars((string)($row["method"] ?? ""), ENT_QUOTES);
    print "</td><td>";
	print htmlspecialchars((string)($row["resolution"] ?? ""), ENT_QUOTES);
	print "</td><td>";
	print htmlspecialchars((string)($row["class"] ?? ""), ENT_QUOTES);
	print "</td><td>";
	print htmlspecialchars((string)($row["name"] ?? ""), ENT_QUOTES);
	print "</td><td>";
	print htmlspecialchars((string)($row["organism"] ?? ""), ENT_QUOTES);
	print "</td></tr>\n";
}

?>

</tbody></table>
</body>
</html>
