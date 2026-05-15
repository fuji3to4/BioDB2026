<?php

require_once __DIR__ . '/db.php';

/**
 * PDB 検索クエリを実行する。
 *
 * @param array{id: string, name: string, class: string, org: string, res: float|null} $filters
 * @return array<int, array<string, mixed>>
 */
function fetch_pdb_search(array $filters): array
{
    $pdo = get_pdo();

    $id    = $filters['id']    !== '' ? $filters['id']    : '%';
    $name  = $filters['name']  !== '' ? $filters['name']  : '%';
    $class = $filters['class'] !== '' ? $filters['class'] : '%';
    $org   = $filters['org']   !== '' ? $filters['org']   : '%';
    $res   = $filters['res'] ?? null;

    $sql = "
        SELECT pdb.pdbid, pdb.method, pdb.resolution, pdb.class, protein.name, protein.organism
        FROM pdb INNER JOIN pdb2protein ON pdb.pdbid = pdb2protein.pdbid INNER JOIN protein ON pdb2protein.proteinid = protein.proteinid
        WHERE (pdb.pdbid LIKE :id)
          AND (pdb.class LIKE :class)
          AND (protein.name LIKE :name)
          AND (protein.organism LIKE :org)
    ";

    if ($res !== null) {
        $sql .= " AND (pdb.resolution <= :res)";
    }

    $stmt = $pdo->prepare($sql);
    $stmt->bindValue(':id',    "%{$id}%",    PDO::PARAM_STR);
    $stmt->bindValue(':class', "%{$class}%", PDO::PARAM_STR);
    $stmt->bindValue(':name',  "%{$name}%",  PDO::PARAM_STR);
    $stmt->bindValue(':org',   "%{$org}%",   PDO::PARAM_STR);

    if ($res !== null) {
        $stmt->bindValue(':res', $res, PDO::PARAM_INT);
    }

    $stmt->execute();
    return $stmt->fetchAll(PDO::FETCH_ASSOC);
}

/**
 * PDBID で1件の詳細情報を取得する。
 *
 * @return array<string, mixed>|null
 */
function fetch_pdb_detail(string $pdbid): ?array
{
    $pdo = get_pdo();

    $stmt = $pdo->prepare("
        SELECT pdb.pdbid, pdb.method, pdb.resolution, pdb.chain, pdb.positions,
               pdb.deposited, pdb.class, pdb.url, protein.name, protein.organism, protein.len
        FROM pdb INNER JOIN pdb2protein ON pdb.pdbid = pdb2protein.pdbid INNER JOIN protein ON pdb2protein.proteinid = protein.proteinid
        WHERE pdb.pdbid = :pdbid
    ");
    $stmt->bindValue(':pdbid', $pdbid, PDO::PARAM_STR);
    $stmt->execute();

    $row = $stmt->fetch(PDO::FETCH_ASSOC);
    return $row !== false ? $row : null;
}
