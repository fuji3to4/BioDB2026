<?php

require_once __DIR__ . '/db.php';

/**
 * protein テーブルの全行を返す。
 *
 * @return array<int, array<string, mixed>>
 */
function fetch_all_proteins(): array
{
    $pdo  = get_pdo();
    $stmt = $pdo->prepare("SELECT proteinid, name, organism, len, fav FROM protein ORDER BY proteinid");
    $stmt->execute();
    return $stmt->fetchAll(PDO::FETCH_ASSOC);
}

/**
 * Protein を1件追加する。fav は 0 固定。
 *
 * @param array{name: string, organism: string, len: int} $data
 */
function create_protein(array $data): void
{
    $pdo  = get_pdo();
    $stmt = $pdo->prepare(
        "INSERT INTO protein(name, organism, len, fav) VALUES (:name, :org, :len, 0)"
    );
    $stmt->bindValue(':name', $data['name'],     PDO::PARAM_STR);
    $stmt->bindValue(':org',  $data['organism'], PDO::PARAM_STR);
    $stmt->bindValue(':len',  $data['len'],      PDO::PARAM_INT);
    $stmt->execute();
}

/**
 * proteinid で1件削除する。
 */
function delete_protein(int $id): void
{
    $pdo  = get_pdo();
    $stmt = $pdo->prepare("DELETE FROM protein WHERE proteinid = :id");
    $stmt->bindValue(':id', $id, PDO::PARAM_INT);
    $stmt->execute();
}

/**
 * fav を1インクリメントする。
 */
function increment_protein_fav(int $id): void
{
    $pdo  = get_pdo();
    $stmt = $pdo->prepare("UPDATE protein SET fav = fav + 1 WHERE proteinid = :id");
    $stmt->bindValue(':id', $id, PDO::PARAM_INT);
    $stmt->execute();
}
