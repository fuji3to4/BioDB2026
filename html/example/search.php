<?php
header('Content-Type: text/html; charset=UTF-8');
require_once __DIR__ . '/lib/pdb_queries.php';

$id    = isset($_GET['id'])    && $_GET['id']    !== '' ? $_GET['id']    : '';
$name  = isset($_GET['name'])  && $_GET['name']  !== '' ? $_GET['name']  : '';
$class = isset($_GET['class']) && $_GET['class'] !== '' ? $_GET['class'] : '';
$org   = isset($_GET['org'])   && $_GET['org']   !== '' ? $_GET['org']   : '';
$res   = isset($_GET['res'])   && $_GET['res']   !== '' ? (float)$_GET['res'] : null;

$rows  = fetch_pdb_search(['id' => $id, 'name' => $name, 'class' => $class, 'org' => $org, 'res' => $res]);
$count = count($rows);
?>
<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">

  <!-- Bootstrap CSS -->
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-sRIl4kxILFvY47J16cr9ZwB07vP4J8+LH7qKQnuqkuIAvNWLzeN8tE5YBujZqJLB" crossorigin="anonymous">
  <title>Search Protein Database</title>
</head>
<body>
<div class="container mt-4">
  <p><a href="proteins.php">Protein Management</a></p>
  <h1>Search Protein Database</h1>

  <form method="get" action="">
    <div class="row g-2 mb-3">
      <div class="col-auto">
        <input class="form-control" name="id"
               value="<?= htmlspecialchars($id, ENT_QUOTES) ?>" placeholder="PDBID">
      </div>
      <div class="col-auto">
        <input class="form-control" name="name"
               value="<?= htmlspecialchars($name, ENT_QUOTES) ?>" placeholder="Protein Name">
      </div>
      <div class="col-auto">
        <input class="form-control" name="org"
               value="<?= htmlspecialchars($org, ENT_QUOTES) ?>" placeholder="Organism">
      </div>
      <div class="col-auto">
        <input class="form-control" name="res"
               value="<?= htmlspecialchars((string)($res ?? ''), ENT_QUOTES) ?>" placeholder="Resolution">
      </div>
      <div class="col-auto">
        <select class="form-select" name="class" aria-label="Protein class">
          <option value="">Any</option>
          <?php foreach (['Enzyme', 'DNA-Binding', 'Membrane', 'Signaling Protein', 'Protein Binding'] as $opt): ?>
            <option value="<?= htmlspecialchars($opt, ENT_QUOTES) ?>"
              <?= $class === $opt ? 'selected' : '' ?>>
              <?= htmlspecialchars($opt, ENT_QUOTES) ?>
            </option>
          <?php endforeach; ?>
        </select>
      </div>
      <div class="col-auto">
        <button class="btn btn-primary" type="submit">Search</button>
      </div>
    </div>
  </form>

  <p><?= $count ?> result(s)</p>

  <table class="table table-striped">
    <thead>
      <tr>
        <th>PDBID</th><th>Method</th><th>Resolution</th>
        <th>Class</th><th>Protein Name</th><th>Organism</th>
      </tr>
    </thead>
    <tbody>
      <?php foreach ($rows as $row): ?>
        <tr>
          <td>
            <a href="pdb_detail.php?pdbid=<?= urlencode((string)($row['pdbid'] ?? '')) ?>">
              <?= htmlspecialchars((string)($row['pdbid'] ?? ''), ENT_QUOTES) ?>
            </a>
          </td>
          <td><?= htmlspecialchars((string)($row['method']     ?? ''), ENT_QUOTES) ?></td>
          <td><?= htmlspecialchars((string)($row['resolution'] ?? ''), ENT_QUOTES) ?></td>
          <td><?= htmlspecialchars((string)($row['class']      ?? ''), ENT_QUOTES) ?></td>
          <td><?= htmlspecialchars((string)($row['name']       ?? ''), ENT_QUOTES) ?></td>
          <td><?= htmlspecialchars((string)($row['organism']   ?? ''), ENT_QUOTES) ?></td>
        </tr>
      <?php endforeach; ?>
    </tbody>
  </table>
</div>
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/js/bootstrap.bundle.min.js" integrity="sha384-FKyoEForCGlyvwx9Hj09JcYn3nv7wiPVlz7YYwJrWVcXK/BmnVDxM+D2scQbITxI" crossorigin="anonymous"></script>
</body>
</html>
