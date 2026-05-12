<?php

$db_user = "user";
$db_pass = "password";
$db_host = "postgres";
$db_name = "demo";

$dsn="pgsql:host={$db_host};dbname={$db_name};options='--client_encoding=UTF8'";

try{
        $pdo = new PDO($dsn,$db_user,$db_pass);

        $pdo->setAttribute(PDO::ATTR_ERRMODE,PDO::ERRMODE_EXCEPTION);
        $pdo->setAttribute(PDO::ATTR_EMULATE_PREPARES,false);

} catch(PDOException $Exception){
        die("DB接続エラー:".$Exception->getMessage());

}
?>