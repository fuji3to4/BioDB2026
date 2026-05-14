<?php
header('Content-Type:text/html; charset=UTF-8');
?>
<!DOCTYPE html>
<html lang="ja">

<head>
<meta name="viewport" content="width=device-width, initial-scale=1">

<!-- Bootstrap CSS -->
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-64UC4BEhTGwk3eGpak4nO2jqtl7liTS+juXkSJ2gPAQPmlClQO7s5UgCeR6US48g" crossorigin="anonymous">
<title>PDB Info.</title>
</head>
<body>

<?php
require('connectdb.php');


$pdbid = (isset($_GET['pdbid']) && $_GET['pdbid'] !== "") ? $_GET['pdbid'] : "%";


$sql = "
select pdb.pdbid, pdb.method, pdb.resolution, pdb.chain, pdb.positions, pdb.deposited, pdb.class, pdb.url, protein.name, protein.organism, protein.len
from pdb natural join pdb2protein natural join protein
where (pdb.pdbid like :id)
";


try{

        $stmh=$pdo->prepare($sql);

        $stmh->bindValue(":id","%{$pdbid}%",PDO::PARAM_STR);
	
        $stmh->execute();

} catch(PDOException $Exception){
        die("DB検索エラー:".$Exception->getMessage());

}

 
$result=$stmh->fetchAll(PDO::FETCH_ASSOC);

$count=count($result);



?>
<head>
<title><?=$result[0]["pdbid"]?></title>
</head>
<body>
<div class="container">
 <div class="row">
  <div class="col-6">
<h1 class="display-5"><?=$result[0]["pdbid"]?></h1>
<h3 class="display-6"><?=$result[0]["name"]?></h3>
<p><b>Organism:</b> <?=$result[0]["organism"]?></br>
<b>Protein length:</b> <?=$result[0]["len"]?> AA</p>

<h3 class="display-6">PDB informations <a href="<?=$result[0]["url"]?>" target="_blank">link</a></h3>
<?php

print "<ul><li><b>Chain:</b> ".$result[0]["chain"]."</li>";
print "<li><b>Positions:</b> ".$result[0]["positions"]."</li>";
print "<li><b>Deposited:</b> ".$result[0]["deposited"]."</li>";
print "<li><b>Method:</b> ".$result[0]["method"]."</li>";
print "<li><b>Resolution:</b> ";
printf("%.2f",$result[0]["resolution"]);
print " &Aring;</li></ul>";


?>
</div>
<div class="col-6">
<img class="img-fluid" src="./pic/<?=$result[0]["pdbid"]?>.jpeg">
</div>
</div>



</div>
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/js/bootstrap.bundle.min.js" integrity="sha384-jdSIJTK9l6XwXj3RixpVDXtMcA2bFd9O81RlLAwhpr2oXRqvQP88rr16IeFXTgFE" crossorigin="anonymous"></script>
</body>


</html>
