<?php
header('Content-Type:text/html; charset=UTF-8');
?>
<!DOCTYPE html>
<html lang="ja">

<head>
<meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">

  <!-- Bootstrap CSS -->
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-64UC4BEhTGwk3eGpak4nO2jqtl7liTS+juXkSJ2gPAQPmlClQO7s5UgCeR6US48g" crossorigin="anonymous">
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



} catch(PDOException $Exception){
        die("DB検索エラー:".$Exception->getMessage());

}

?>

<div class="container">
  <div class="col-10">
        <p>検索結果は<?=$count?>件です。</p>


<table class="table table-striped">
<thead>
<tr><th>PDBID</th><th>Method</th><th>Resolution</th><th>Class</th><th>Protein Name</th><th>Organism</th></tr>
</thead>
<tbody>

<?php
 
$result=$stmh->fetchAll(PDO::FETCH_ASSOC);

foreach($result as $row) {
	print "<tr><td>";

	/*search_get.phpとここだけ異なる
	<a>タグを入れてリンクを貼っている*/
	print "<a href='./link2pdb_bs.php?pdbid=".urlencode((string)($row["pdbid"] ?? ""))."'>";
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
  </div>
</div>

<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/js/bootstrap.bundle.min.js" integrity="sha384-jdSIJTK9l6XwXj3RixpVDXtMcA2bFd9O81RlLAwhpr2oXRqvQP88rr16IeFXTgFE" crossorigin="anonymous"></script>

</body>
</html>
