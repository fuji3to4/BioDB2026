# 🐳 BioDB2026 Docker 環境 徹底解説

## 1. Docker って何？

**Docker** は「アプリケーションを動かすための軽量な仮想マシン」のようなものです。

普通、プログラミングの学習を始めるときに、

- 「PostgreSQL（データベース）をインストールして…」
- 「PHP や Apache をインストールして…」
- 「Node.js をインストールして…」

と、たくさんのソフトウェアを自分のパソコンに直接入れなければいけません。しかもバージョンの組み合わせによって動かなかったり、他のプロジェクトと干渉したりと大変です。

**Docker なら**、必要なソフトを「コンテナ」という隔離された箱に入れて、**コマンド 1 つで全部まとめて起動**できます。しかもパソコンを汚しません。学習が終わったら `docker compose down` でキレイさっぱり消せます。

---

## 2. この環境全体の構成

BioDB2026 は、**3 つのコンテナ** が連携して動いています。

```
┌─────────────────────────────────────────────────────────────┐
│                    あなたのパソコン                           │
│                                                             │
│  ┌──────────────────┐   ┌──────────────────┐   ┌──────────┐ │
│  │   PostgreSQL     │   │   PHP/Apache     │   │  Next.js │ │
│  │   (DBサーバー)    │   │   (Webサーバー)   │   │ (Node.js)│ │
│  │                  │   │                  │   │          │ │
│  │   ポート 5432     │   │   ポート 80      │   │ ポート3000│ │
│  └────────┬─────────┘   └────────┬─────────┘   └─────┬────┘ │
│           │                      │                    │     │
│           └──────────────────────┴────────────────────┘     │
│                             ▲                               │
│                             │  docker compose up で一括起動  │
└─────────────────────────────────────────────────────────────┘
```

### 各コンテナの役割

| コンテナ名 | 役割 | アクセス方法 |
|-----------|------|------------|
| **biodb-postgres** | データベースサーバー (PostgreSQL 17) | `localhost:5432` |
| **biodb-php** | PHP + Apache の Web サーバー | `localhost:80`（つまり http://localhost） |
| **biodb-nextjs** | Next.js 開発サーバー | `localhost:3000` |

---

## 3. 起動方法（たった 1 行）

プロジェクトのルートフォルダ（`docker-compose.yml` がある場所）で、以下のコマンドを実行します。

```bash
docker compose up -d
```

たったこれだけです。`-d` は「バックグラウンドで起動する」という意味です（付けなくても OK ですが、ターミナルが専有されます）。

### 初回だけ時間がかかる理由

初回は Docker が **イメージ**（コンテナの設計図）をダウンロード＆ビルドするので、回線速度にもよりますが **数分〜十数分** かかることがあります。

- PostgreSQL 17 の公式イメージを取得
- PHP 8.3 + Apache のイメージを取得し、さらに日本語ロケールや PostgreSQL 接続モジュールを追加ビルド
- Node.js 24 のイメージを取得

2 回目以降はダウンロード済みのイメージを使うので、**数秒で起動**します。

---

## 4. 各コンテナの詳細解説

### 4.1 PostgreSQL コンテナ（`biodb-postgres`）

#### docker-compose.yml の該当部分

```yaml
postgres:
  build: ./docker/postgres        # 設計図: docker/postgres/Dockerfile
  container_name: biodb-postgres  # コンテナの名前
  ports:
    - "127.0.0.1:5432:5432"      # 自分のPCの5432番 → コンテナの5432番
  volumes:
    - pgdata:/var/lib/postgresql/data  # データを永続化
    - ./SQL:/home/user/SQL             # SQLフォルダをコンテナ内にマウント
  environment:
    POSTGRES_USER: postgres
    POSTGRES_PASSWORD: password
    POSTGRES_DB: postgres
```

#### ポイント解説

| 設定 | 意味 |
|------|------|
| `ports: "127.0.0.1:5432:5432"` | 自分のパソコンの `localhost:5432` にアクセスすると、コンテナ内の PostgreSQL（ポート5432）に繋がる |
| `volumes: pgdata:...` | Docker が管理する領域。コンテナを削除しても DB の内容は消えない |
| `volumes: ./SQL:/home/user/SQL` | Windows 上の `SQL/` フォルダをコンテナ内の `/home/user/SQL` に**直接マウント**。あなたが `SQL/setting.sql` を編集すると、即座にコンテナ内にも反映される |
| `build: ./docker/postgres` | `docker/postgres/Dockerfile` の手順でカスタムイメージを作る |

#### Dockerfile（`docker/postgres/Dockerfile`）

```dockerfile
FROM postgres:17                              # PostgreSQL 17 をベースに
RUN apt-get install -y locales                # 日本語ロケールをインストール
ENV LANG=ja_JP.UTF-8                          # 日本語環境に設定
COPY ./init.sql /docker-entrypoint-initdb.d/  # 初期化SQL（初回起動時に自動実行）
WORKDIR /home/user/SQL                        # 作業ディレクトリ
```

#### init.sql（初回起動時に自動実行）

```sql
CREATE ROLE "user" LOGIN PASSWORD 'password';  -- ユーザー名: user, パスワード: password
ALTER ROLE "user" ... CREATEDB;                -- user はデータベース作成可能
```

この `user` というユーザーで、演習では `setting.sql` や `demo.sql` を実行して学習用データベースを作ります。

---

### 4.2 PHP + Apache コンテナ（`biodb-php`）

#### docker-compose.yml の該当部分

```yaml
php:
  build: ./docker/php
  container_name: biodb-php
  ports:
    - "127.0.0.1:80:80"           # localhost:80 → コンテナ内Apache
  volumes:
    - ./html:/html                 # htmlフォルダをコンテナに直接マウント
  depends_on:
    - postgres                     # PostgreSQLが先に起動するのを待つ
```

#### Dockerfile（`docker/php/Dockerfile`）

```dockerfile
FROM php:8.3-apache-bookworm       # PHP 8.3 + Apache が入ったイメージ
ENV TZ=Asia/Tokyo                  # タイムゾーンを日本に設定
COPY php.ini /usr/local/etc/php/   # PHPの設定ファイルをコピー
COPY 000-default.conf /etc/apache2/sites-available/  # Apacheの設定
RUN docker-php-ext-install pdo_pgsql pgsql mbstring  # PostgreSQL接続用の拡張モジュール
RUN ln -s /html /var/www/html      # /html を Web 公開フォルダにリンク
```

#### ポイント解説

- `html/` フォルダに PHP ファイルを置くだけで、`http://localhost/ファイル名.php` でアクセスできます。
- 既に `html/sample.php` や `html/example/` にサンプルファイルが用意されています。
- PHP から PostgreSQL に接続するための `pdo_pgsql`（PDO経由）と `pgsql`（専用関数）がインストール済み。
- `php.ini`（後述）ではエラー表示が有効なので、学習中にミスしてもエラーメッセージが表示されます。

#### php.ini（`docker/php/php.ini`）

```ini
display_errors=On        # エラーを画面に表示する（学習中は便利）
error_reporting=E_ALL    # すべてのエラーを報告する
date.timezone=Asia/Tokyo # タイムゾーンを日本に
```

#### Apache 設定（`docker/php/000-default.conf`）

```apache
<VirtualHost *:80>
    DocumentRoot /var/www/html         # Web公開のルートフォルダ

    <Directory /var/www/html>
        Options Indexes FollowSymLinks  # ディレクトリ一覧表示を許可
        AllowOverride None
        Require all granted             # すべてのアクセスを許可
    </Directory>
</VirtualHost>
```

---

### 4.3 Next.js コンテナ（`biodb-nextjs`）

#### docker-compose.yml の該当部分

```yaml
nextjs:
  build: ./docker/nextjs
  container_name: biodb-nextjs
  ports:
    - "127.0.0.1:3000:3000"       # localhost:3000 → Next.js開発サーバー
  volumes:
    - ./my-app:/app                # my-appフォルダをコンテナにマウント
    - /app/node_modules            # node_modulesはコンテナ内部だけで管理（※）
    - /app/.next                   # .nextも同様（※）
  environment:
    DATABASE_URL: postgresql://user:password@postgres:5432/demo
    WATCHPACK_POLLING: "true"      # Windows用のファイル変更検知
    CHOKIDAR_USEPOLLING: "true"    # 同上
  tty: true
```

> **※ `node_modules` と `.next` を名前付きボリュームにしている理由**
>
> Windows と Linux ではファイルシステムの仕組みが異なります。Windows 上のフォルダを Linux コンテナにマウントすると、シンボリックリンクやパーミッションで問題が起きることがあります。`node_modules` を名前付きボリュームにすることで、コンテナの Linux 環境内だけでモジュールを管理でき、こうした問題を回避できます。

#### Dockerfile（`docker/nextjs/Dockerfile`）

```dockerfile
FROM node:24-slim                  # Node.js 24 の最小限イメージ
WORKDIR /app                       # 作業ディレクトリ
CMD ["tail", "-f", "/dev/null"]    # 待機（何もしない）
```

このコンテナは「何もしないで待機」するだけです。実際の Next.js 開発サーバーは **VS Code のターミナルなどから自分で起動**します。

```bash
# Next.js の開発サーバーを起動
docker compose exec nextjs npm run dev
```

または、コンテナ内で bash を起動してから npm コマンドを実行することもできます。

```bash
docker compose exec nextjs bash
# コンテナ内で:
npm run dev
```

#### 環境変数の意味

| 環境変数 | 値 | 意味 |
|---------|-----|------|
| `DATABASE_URL` | `postgresql://user:password@postgres:5432/demo` | PostgreSQL への接続文字列。ユーザー名 `user`、パスワード `password`、ホスト名 `postgres`（コンテナ名）、データベース名 `demo` |
| `WATCHPACK_POLLING` | `"true"` | ファイル変更を**ポーリング方式**で検知する。これを入れないと、Windows 上でコードを編集しても Next.js のホットリロードが効かないことがある |
| `CHOKIDAR_USEPOLLING` | `"true"` | 同上。Node.js のファイル監視ライブラリ Chokidar にポーリングを使わせる |

---

## 5. 実習での使い方（ステップバイステップ）

### 5.1 起動する

```bash
# プロジェクトのルートフォルダで実行
docker compose up -d
```

### 5.2 データベースを準備する

```bash
# デモデータベース（演習4〜5で使うPDBデータ）を作る
docker compose exec postgres psql -U user -d postgres -f /home/user/SQL/demo.sql

# SQL練習用データベース（演習1で使う）を作る
docker compose exec postgres psql -U user -d postgres -f /home/user/SQL/setting.sql
```

**コマンドの意味：**

| 部分 | 説明 |
|------|------|
| `docker compose exec postgres` | postgres コンテナの中でコマンドを実行せよ |
| `psql -U user -d postgres` | PostgreSQL に `user` として `postgres` データベースに接続 |
| `-f /home/user/SQL/demo.sql` | 指定された SQL ファイルを実行せよ |

### 5.3 psql を起動して SQL を直接打つ

```bash
# demo データベースに接続
docker compose exec postgres psql -U user -d demo
```

実行すると `demo=#` というプロンプトが表示され、ここで SQL を直接入力できます。

```sql
-- テーブル一覧を表示
\dt

-- SELECT文を実行
SELECT pdbid, method FROM pdb;

-- PostgreSQL を終了する
\q
```

### 5.4 PHP サンプルをブラウザで確認する

- http://localhost/sample.php → データベース接続確認（「Connected database: postgres」と表示されれば OK）
- http://localhost/example/search-pdb-simple.php → PDB データの簡易検索
- http://localhost/example/proteins.php → タンパク質データの CRUD 操作（追加・削除・更新）
- http://localhost/example/search.php → 検索ページ

### 5.5 Next.js サンプルを確認する

http://localhost:3000 にアクセス。

サンプルページ:
- http://localhost:3000/example
- http://localhost:3000/example-spa
- http://localhost:3000/search-pdb-simple

### 5.6 Adminer を使う（GUI で DB 操作）

http://localhost/adminer-5.4.2.php にアクセスすると、ブラウザ上でデータベースを GUI 操作できるツール **Adminer** が使えます。

ログイン情報：

| 項目 | 値 |
|------|-----|
| システム | PostgreSQL |
| サーバ | `postgres`（コンテナ名） |
| ユーザ名 | `user` |
| パスワード | `password` |
| データベース | （空欄でも OK） |

---

## 6. よく使うコマンド一覧

| やりたいこと | コマンド |
|------------|---------|
| **起動** | `docker compose up -d` |
| **停止**（コンテナは残る） | `docker compose stop` |
| **停止して削除**（コンテナも消える） | `docker compose down` |
| **完全削除**（データも消える） | `docker compose down -v` |
| **状態確認** | `docker compose ps` |
| **ログをリアルタイム表示** | `docker compose logs -f` |
| **特定コンテナのログ** | `docker compose logs -f postgres` |
| **コンテナ内でコマンド実行** | `docker compose exec postgres psql -U user -d demo` |
| **コンテナ内で bash** | `docker compose exec postgres bash` |
| **イメージを再ビルド**（Dockerfile 変更時） | `docker compose build --no-cache` |

---

## 7. トラブルシューティング（よくある問題と解決策）

### ❌ `docker compose` が認識されない

**原因:** Docker Desktop がインストールされていません。

**解決策:** [Docker Desktop](https://www.docker.com/products/docker-desktop/) をインストールしてください。

---

### ❌ ポートが競合する（5432 / 80 / 3000 が既に使われている）

**原因:** 別のアプリが同じポートを使っています。
- ポート5432 → 別の PostgreSQL が直接インストールされている
- ポート80 → Skype や IIS など
- ポート3000 → 別の Node.js アプリ

**解決策:** `docker-compose.yml` のポート番号を変更します。

```yaml
# 例: ポート80の代わりに8080を使う
ports:
  - "127.0.0.1:8080:80"   # localhost:8080 でアクセス可能に
```

---

### ❌ PostgreSQL に接続できない

**確認手順:**

```bash
# コンテナが起動しているか確認
docker compose ps

# PostgreSQL のログを確認
docker compose logs postgres
```

---

### ❌ Node.js のモジュールが見つからない（`ERR_MODULE_NOT_FOUND` など）

**原因:** `node_modules` がコンテナ内にインストールされていません。

**解決策:** コンテナ内で `npm install` を実行します。

```bash
docker compose exec nextjs npm install
```

---

### ❌ コードを変更してもブラウザが自動更新されない

**原因:** Windows と Docker のファイル通知の違い。

**解決策:** `docker-compose.yml` に以下の設定が入っていることを確認してください（初めから入っています）。

```yaml
environment:
  WATCHPACK_POLLING: "true"
  CHOKIDAR_USEPOLLING: "true"
```

---

## 8. フォルダ構成まとめ

```
BioDB2026/
│
├── docker-compose.yml          ← ★ 全体の設計図（これが全ての中心）
│
├── docker/                     ← ★ 各コンテナの設計図（このフォルダ）
│   ├── postgres/
│   │   ├── Dockerfile          ← PostgreSQL コンテナの設計図
│   │   └── init.sql            ← 初回起動時に自動実行される初期化SQL
│   ├── php/
│   │   ├── Dockerfile          ← PHP コンテナの設計図
│   │   ├── php.ini             ← PHP の設定（エラー表示など）
│   │   └── 000-default.conf    ← Apache の設定
│   └── nextjs/
│       └── Dockerfile          ← Next.js コンテナの設計図
│
├── SQL/                        ← ★ SQL ファイル置き場（PostgreSQL から見える）
│   ├── demo.sql                ← デモデータ（PDB タンパク質データベース）
│   ├── setting.sql             ← 演習1で使う練習用データ
│   ├── demo_from_csv.sql       ← CSV からのインポート用
│   └── pdb.csv, protein.csv, pdb2protein.csv
│
├── html/                       ← ★ PHP ファイル置き場（http://localhost/ で見える）
│   ├── sample.php              ← 接続確認用サンプル
│   ├── adminer-5.4.2.php       ← Adminer（DB GUI ツール）
│   └── example/                ← 演習用サンプルプログラム群
│       ├── search-pdb-simple.php
│       ├── search.php
│       ├── proteins.php
│       ├── pdb_detail.php
│       └── lib/                ← DB接続やクエリのライブラリ
│
└── my-app/                     ← ★ Next.js プロジェクト（http://localhost:3000）
    ├── package.json
    ├── next.config.ts
    └── src/
        ├── app/                ← ページファイル（フォルダ＝URL）
        │   ├── page.tsx        ← トップページ
        │   ├── example/        ← サンプルページ
        │   ├── example-spa/    ← SPA サンプル
        │   └── search-pdb-simple/
        ├── components/         ← 共通部品
        └── lib/                ← データベース操作ライブラリ
            ├── db.ts           ← DB接続
            ├── pdb.ts          ← PDBデータ操作
            └── proteins.ts     ← タンパク質データ操作
```

---

## 9. この環境で学習できること

| 演習 | 内容 | 使う技術 |
|------|------|---------|
| **演習1** | SQL の基本（SELECT 文） | `psql`, PostgreSQL |
| **演習2** | データベース設計（E-R図、正規化） | 設計図作成（紙 or Excel） |
| **演習3** | データベース作成、Adminer 操作 | SQL, Adminer（ブラウザ上のGUI） |
| **演習4** | データベース表示Webページ作成 | PHP + PostgreSQL **または** Next.js + Drizzle ORM |
| **演習5** | Web データベース検索アプリ作成 | PHP **または** Next.js（Server Actions） |

---

## 10. （おまけ）Docker の用語集

| 用語 | 意味 |
|------|------|
| **イメージ** | コンテナの設計図。Dockerfile から作られる。例: `postgres:17` |
| **コンテナ** | イメージを元にして動いている実際の「箱」。コンテナの中でアプリが動く |
| **Dockerfile** | イメージをどうやって作るかを書いたレシピ |
| **docker-compose.yml** | 複数のコンテナをどう連携させるかを書いた全体構成図 |
| **ボリューム** | コンテナを消してもデータを残すための永続化領域 |
| **マウント** | ホスト（パソコン）のフォルダをコンテナの中に生きたまま差し込むこと |
| **ポート** | コンテナの外からアクセスするための窓口番号 |

---
