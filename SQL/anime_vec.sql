-- PostgreSQL用のデモデータ（アニメ統一・ベクトル検索演習用）
-- データベースを毎回クリーンに作り直すスクリプト
-- 実行例: psql -U postgres -d postgres -f anime_vec.sql

-- 既存のデータベースを削除して作り直し
DROP DATABASE IF EXISTS anime_vec;
CREATE DATABASE anime_vec OWNER "user";

-- 1 anime_vecデータベースに接続（現在は postgres ユーザー）
\connect anime_vec

-- 2 管理者の力で、拡張機能を入れる
CREATE EXTENSION IF NOT EXISTS vector;

\connect anime_vec "user"
-- （これ以降の処理は、一般ユーザーである "user" の権限で実行されます）

--------------------------------------------------
-- 1. テーブルの作成（リレーション構造）
--------------------------------------------------

-- ① アニメ作品マスタ（ここに5次元の気分ベクトルを持たせます）
-- ベクトルの5次元は [ワクワク, しんみり, ほっこり, ハラハラ, ゲラゲラ]
CREATE TABLE animes (
    anime_id SERIAL NOT NULL,
    title VARCHAR(100) NOT NULL,
    media_type VARCHAR(20) NOT NULL, -- TV, Movie, OVA など
    episodes INT,
    aired_date DATE NOT NULL,        -- 放送開始日 (YYYY-MM-DD)
    mood_vector vector(5) NOT NULL,  -- 気分ベクトル
    PRIMARY KEY(anime_id)
);



--------------------------------------------------
-- 2. データの挿入
--------------------------------------------------

-- アニメデータの挿入
INSERT INTO animes (anime_id, title, media_type, episodes, aired_date, mood_vector) VALUES
(1, '進撃の巨人', 'TV', 87, '2013-04-07', '[1.0, 0.7, 0.0, 0.9, 0.1]'),
(2, '葬送のフリーレン', 'TV', 28, '2023-09-29', '[0.6, 0.8, 0.8, 0.3, 0.4]'),
(3, '日常', 'TV', 26, '2011-04-03', '[0.2, 0.1, 0.8, 0.1, 1.0]'),
(4, 'ヴァイオレット・エヴァーガーデン', 'TV', 13, '2018-01-11', '[0.3, 1.0, 0.5, 0.2, 0.0]');


