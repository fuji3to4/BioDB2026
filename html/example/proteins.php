<?php
header('Content-Type: text/html; charset=UTF-8');
require_once __DIR__ . '/lib/protein_queries.php';

// --- POST アクション処理（PRG パターン） ---
// Next.js の actions.ts に相当
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $action = $_POST['action'] ?? '';

    if ($action === 'create') {
        $name = trim($_POST['name']     ?? '');
        $org  = trim($_POST['organism'] ?? '');
        $len  = (int)($_POST['len']     ?? 0);
        if ($name !== '' && $org !== '' && $len > 0) {
            create_protein(['name' => $name, 'organism' => $org, 'len' => $len]);
        }
    } elseif ($action === 'delete') {
        $id = (int)($_POST['proteinid'] ?? 0);
        if ($id > 0) {
            delete_protein($id);
        }
    } elseif ($action === 'fav') {
        $id = (int)($_POST['proteinid'] ?? 0);
        if ($id > 0) {
            increment_protein_fav($id);
        }
    }

    header('Location: proteins.php');
    exit;
}

// --- データ取得 ---
$proteins = fetch_all_proteins();
?>
<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">

  <!-- Bootstrap CSS -->
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-sRIl4kxILFvY47J16cr9ZwB07vP4J8+LH7qKQnuqkuIAvNWLzeN8tE5YBujZqJLB" crossorigin="anonymous">

  <title>Protein Management</title>
</head>
<body>
<div class="container mt-4">
  <p><a href="search.php">← Back to Search</a></p>
  <h1>Protein Management</h1>

  <!-- 追加フォーム / Next.js の protein-create-form.tsx に相当 -->
  <h2>Add Protein</h2>
  <form method="post" action="">
    <input type="hidden" name="action" value="create">
    <div class="row g-2 mb-3">
      <div class="col-auto">
        <input class="form-control" name="name" placeholder="Protein Name" required>
      </div>
      <div class="col-auto">
        <input class="form-control" name="organism" placeholder="Organism" required>
      </div>
      <div class="col-auto">
        <input class="form-control" name="len" type="number" min="1" placeholder="Length (AA)" required>
      </div>
      <div class="col-auto">
        <button class="btn btn-success" type="submit">Add</button>
      </div>
    </div>
  </form>

  <!-- 一覧 -->
  <h2>Protein List</h2>
  <table class="table table-striped">
    <thead>
      <tr>
        <th>ID</th><th>Name</th><th>Organism</th><th>Length</th><th>Fav</th><th>Actions</th>
      </tr>
    </thead>
    <tbody>
      <?php foreach ($proteins as $p): ?>
        <tr>
          <td><?= htmlspecialchars((string)($p['proteinid'] ?? ''), ENT_QUOTES) ?></td>
          <td><?= htmlspecialchars((string)($p['name']      ?? ''), ENT_QUOTES) ?></td>
          <td><?= htmlspecialchars((string)($p['organism']  ?? ''), ENT_QUOTES) ?></td>
          <td><?= htmlspecialchars((string)($p['len']       ?? ''), ENT_QUOTES) ?></td>
          <td><?= htmlspecialchars((string)($p['fav']       ?? 0),  ENT_QUOTES) ?></td>
          <td>
            <form method="post" action="" style="display:inline">
              <input type="hidden" name="action"    value="fav">
              <input type="hidden" name="proteinid" value="<?= (int)($p['proteinid'] ?? 0) ?>">
              <button class="btn btn-sm btn-outline-warning" type="submit">★ Fav</button>
            </form>
            <form method="post" action="" style="display:inline">
              <input type="hidden" name="action"    value="delete">
              <input type="hidden" name="proteinid" value="<?= (int)($p['proteinid'] ?? 0) ?>">
              <button class="btn btn-sm btn-outline-danger" type="submit"
                      onclick="return confirm('削除しますか？')">Delete</button>
            </form>
          </td>
        </tr>
      <?php endforeach; ?>
    </tbody>
  </table>
</div>
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/js/bootstrap.bundle.min.js" integrity="sha384-FKyoEForCGlyvwx9Hj09JcYn3nv7wiPVlz7YYwJrWVcXK/BmnVDxM+D2scQbITxI" crossorigin="anonymous"></script>

</body>
</html>
