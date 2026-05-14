<?php
header('Content-Type: text/html; charset=UTF-8');
require_once __DIR__ . '/lib/pdb_queries.php';

$pdbid = isset($_GET['pdbid']) ? trim($_GET['pdbid']) : '';
if ($pdbid === '') {
    die('pdbid が未指定です。');
}

$row = fetch_pdb_detail($pdbid);
if ($row === null) {
    die('該当するPDBエントリが見つかりません: ' . htmlspecialchars($pdbid, ENT_QUOTES));
}
?>
<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">

  <!-- Bootstrap CSS -->
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-sRIl4kxILFvY47J16cr9ZwB07vP4J8+LH7qKQnuqkuIAvNWLzeN8tE5YBujZqJLB" crossorigin="anonymous">

  <title><?= htmlspecialchars((string)($row['pdbid'] ?? ''), ENT_QUOTES) ?></title>
</head>
<body>
<div class="container mt-4">
  <p><a href="search.php">← Back to Search</a></p>

  <h1><?= htmlspecialchars((string)($row['pdbid'] ?? ''), ENT_QUOTES) ?></h1>
  <h3><?= htmlspecialchars((string)($row['name']   ?? ''), ENT_QUOTES) ?></h3>

  <p>
    <strong>Organism:</strong> <?= htmlspecialchars((string)($row['organism'] ?? ''), ENT_QUOTES) ?><br>
    <strong>Protein length:</strong> <?= htmlspecialchars((string)($row['len'] ?? ''), ENT_QUOTES) ?> AA
  </p>

  <h3>
    PDB Information
    <a href="<?= htmlspecialchars((string)($row['url'] ?? ''), ENT_QUOTES) ?>" target="_blank">link</a>
  </h3>
  <ul>
    <li><strong>Chain:</strong>     <?= htmlspecialchars((string)($row['chain']     ?? ''), ENT_QUOTES) ?></li>
    <li><strong>Positions:</strong> <?= htmlspecialchars((string)($row['positions'] ?? ''), ENT_QUOTES) ?></li>
    <li><strong>Deposited:</strong> <?= htmlspecialchars((string)($row['deposited'] ?? ''), ENT_QUOTES) ?></li>
    <li><strong>Method:</strong>    <?= htmlspecialchars((string)($row['method']    ?? ''), ENT_QUOTES) ?></li>
    <li><strong>Resolution:</strong> <?= number_format((float)($row['resolution'] ?? 0), 2) ?> Å</li>
  </ul>

  <img class="img-fluid"
       src="../examples/pic/<?= htmlspecialchars((string)($row['pdbid'] ?? ''), ENT_QUOTES) ?>.jpeg"
       alt="<?= htmlspecialchars((string)($row['pdbid'] ?? ''), ENT_QUOTES) ?>">
</div>
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/js/bootstrap.bundle.min.js" integrity="sha384-FKyoEForCGlyvwx9Hj09JcYn3nv7wiPVlz7YYwJrWVcXK/BmnVDxM+D2scQbITxI" crossorigin="anonymous"></script>

</body>
</html>
