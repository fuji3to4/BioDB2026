<?php

function get_pdo(): PDO
{
    // 環境変数から取得（なければdocker用の値を使用）
    $db_host = getenv('PGHOST') ?: "postgres";
    $db_name = getenv('PGDATABASE') ?: "demo";
    $db_user = getenv('PGUSER') ?: "user";
    $db_pass = getenv('PGPASSWORD') ?: "password";
    $db_ssl  = getenv('PGSSLMODE') ?: "require"; 

    // DSNに sslmode を追加
    $dsn = "pgsql:host={$db_host};dbname={$db_name};sslmode={$db_ssl};options='--client_encoding=UTF8'";

    $pdo = new PDO($dsn, $db_user, $db_pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $pdo->setAttribute(PDO::ATTR_EMULATE_PREPARES, false);

    return $pdo;
}