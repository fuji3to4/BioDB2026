<?php
// api/detail.php
header('Content-Type: application/json; charset=UTF-8');
require('connectdb.php');

// CORSの設定 - 開発環境用
header('Access-Control-Allow-Origin: http://localhost:3000');
header('Access-Control-Allow-Origin: http://127.0.0.1:3000');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// PDB IDの取得と検証
$pdbid = (isset($_GET['pdbid']) && $_GET['pdbid'] !== "") ? $_GET['pdbid'] : "%";

if (!$pdbid) {
    http_response_code(400);
    echo json_encode([
        'status' => 'error',
        'message' => 'PDB ID is required'
    ]);
    exit;
}

$sql = "
SELECT 
    pdb.pdbid, 
    pdb.method, 
    pdb.resolution,
    pdb.chain,
    pdb.positions,
    pdb.deposited,
    pdb.class,
    pdb.url,
    protein.name, 
    protein.organism,
    protein.len
FROM pdb 
NATURAL JOIN pdb2protein 
NATURAL JOIN protein
WHERE pdb.pdbid = :id
";

try {
    $stmh = $pdo->prepare($sql);
    $stmh->bindValue(":id", $pdbid, PDO::PARAM_STR);
    $stmh->execute();
    
    $result = $stmh->fetch(PDO::FETCH_ASSOC);
    
    if ($result) {
        echo json_encode([
            'status' => 'success',
            'data' => $result
        ], JSON_UNESCAPED_UNICODE);
    } else {
        http_response_code(404);
        echo json_encode([
            'status' => 'error',
            'message' => 'PDB not found'
        ], JSON_UNESCAPED_UNICODE);
    }

} catch(PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'status' => 'error',
        'message' => 'データベースエラーが発生しました'
    ],JSON_UNESCAPED_UNICODE);
}
?>