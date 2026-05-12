-- CSVインポート用スクリプト（PostgreSQL）
-- 前提: docker-compose により /home/user/SQL にCSVがマウントされています
-- 実行例（コンテナ内）: psql -U user -d postgres -f /home/user/SQL/demo_from_csv.sql

-- デモDBへ接続
DROP DATABASE IF EXISTS demo;
CREATE DATABASE demo OWNER "user";

-- demoデータベースに接続
\connect demo

-- テーブルを作成する
CREATE TABLE pdb(
    pdbid CHAR(4) NOT NULL,
    method CHAR(20) NOT NULL,
    resolution FLOAT,
    chain CHAR(20) NOT NULL,
    positions CHAR(10) NOT NULL,
    deposited DATE NOT NULL,     -- date型という日付用の型。YYYY-MM-DD
    class CHAR(30),
    url TEXT,                    -- 長い文字列用にtext型。PostgreSQLではサイズ制限なし
    PRIMARY KEY(pdbid)           -- 主キー(primary key)の設定
);


CREATE TABLE protein(
    proteinid SERIAL NOT NULL,   -- SERIAL（自動番号付け）。MySQLのAUTO_INCREMENTに相当
    name CHAR(50) NOT NULL,
    organism CHAR(30) NOT NULL,
    len INT NOT NULL,
    fav INT NOT NULL,
    PRIMARY KEY(proteinid)
);

CREATE TABLE pdb2protein(
    pdbid CHAR(4) NOT NULL,
    proteinid INT NOT NULL,
    PRIMARY KEY(pdbid, proteinid)  -- 主キーが複合キーの場合キーとなる属性を並べる
);

-- PDB をCSVからインポート
\copy pdb (pdbid, method, resolution, chain, positions, deposited, class, url) FROM '/home/user/SQL/pdb.csv' WITH (FORMAT csv, HEADER true, NULL 'null');

-- Protein をCSVからインポート
-- CSVに proteinid が含まれるため列を明示し、シーケンス値を調整します
\copy protein (proteinid, name, organism, len, fav) FROM '/home/user/SQL/protein.csv' WITH (FORMAT csv, HEADER true, NULL 'null');

-- SERIAL列のシーケンスをCSV投入後の最大IDに合わせる
SELECT setval(
    pg_get_serial_sequence('protein', 'proteinid'),
    COALESCE(MAX(proteinid), 1)
)
FROM protein;

-- PDB2Protein をCSVからインポート
\copy pdb2protein (pdbid, proteinid) FROM '/home/user/SQL/pdb2protein.csv' WITH (FORMAT csv, HEADER true, NULL 'null');
