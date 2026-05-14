<?php
header('Content-Type:text/html; charset=UTF-8');
?>
<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <title>検索結果</title>
</head>
<body>

<?php
require('connectdb.php');


try {
    $sql = "SELECT pdb.pdbid, pdb.resolution, protein.name, protein.organism
            FROM protein, pdb, pdb2protein
            WHERE pdb.pdbid = pdb2protein.pdbid
            AND protein.proteinid = pdb2protein.proteinid 
            AND pdb.resolution <= 2.5";
    
    $stmh = $pdo->prepare($sql);
    $stmh->execute();
    
    $status = 'success';
    $count = $stmh->rowCount();
    $data = $stmh->fetchAll(PDO::FETCH_ASSOC);
    
} catch(PDOException $Exception) {
    http_response_code(500);
    $message = "DB検索エラー: " . $Exception->getMessage();
}

?>

<!-- 表のヘッダーの記述 -->
<table border='1' cellpadding='2' cellspacing='0'>
<thead>
        <tr bgcolor='#00CCCC'>
        <th>PDBID</th>
        <th>Resolution</th>
        <th>Protein name</th>
        <th>Organism</th>
        </tr>
</thead>
<tbody>

<?php //phpを再開させる


print "<br>検索結果は{$count}件です。<br><br>";
//$result配列から１つずつ読み出して$rowに格納のループ
foreach($data as $row) {
        print "<tr><td>";
        //連想配列$rowからPDBIDのみをprint
        //htmspecialchars()はhtmlタグとして使用される「<」「>」などを無視する
    print htmlspecialchars((string)($row["pdbid"] ?? ""), ENT_QUOTES);
        print "</td><td>";
    print htmlspecialchars((string)($row["resolution"] ?? ""), ENT_QUOTES);
        print "</td><td>";
    print htmlspecialchars((string)($row["name"] ?? ""), ENT_QUOTES);
        print "</td><td>";
    print htmlspecialchars((string)($row["organism"] ?? ""), ENT_QUOTES);
        print  "</td></tr>";
}


?>
</tbody></table>

</body>
</html>

