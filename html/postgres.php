<?php
$dsn = 'pgsql:host=postgres;port=5432;dbname=postgres';
$user = 'user';
$password = 'password';

try {
    $pdo = new PDO($dsn, $user, $password, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
    ]);
    $result = $pdo->query('SELECT current_database() AS db_name')->fetch(PDO::FETCH_ASSOC);
} catch (PDOException $e) {
    http_response_code(500);
    echo 'Database connection failed: ' . htmlspecialchars($e->getMessage(), ENT_QUOTES, 'UTF-8');
    exit;
}
?>
<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <title>PHP PostgreSQL Sample</title>
</head>
<body>
    <h1>PHP PostgreSQL Sample</h1>
    <p>Connected database: <?php echo htmlspecialchars($result['db_name'], ENT_QUOTES, 'UTF-8'); ?></p>
</body>
</html>
