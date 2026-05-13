[en](README_en.md) | [ja](README.md)

# BioDB2026 演習環境

このリポジトリは、Docker Compose上でPostgreSQL、PHP、Next.jsを動かすための演習環境です。

英語版は `README_en.md` を参照してください。

## コンテナの起動

```powershell
docker compose up -d
```

これにより次が起動します。

- PostgreSQL: `127.0.0.1:5432`（ホストのループバックのみ）
- PHP/Apache: `http://localhost/`（`127.0.0.1:80`、ホストのループバックのみ）
- `nextjs`コンテナ: `127.0.0.1:3000` を公開（ホストのループバックのみ）

`docker compose up -d` だけでは Next.js の開発サーバーは起動しません。実行中の `nextjs` コンテナに接続し、以下の手動手順を完了するまで `http://localhost:3000/` は利用できません。

## PostgreSQL の手動セットアップ

マウントされるSQLファイルは、**演習用の手動セットアップ手順**です。`docker compose up -d` では自動適用されません。

サンプルDBが必要なときは、リポジトリルートで次を実行してください。

```powershell
docker compose exec postgres psql -U user -d postgres -f /home/user/SQL/demo.sql
docker compose exec postgres psql -U user -d postgres -f /home/user/SQL/setting.sql
```

- `user` ロールは演習フロー向けに意図的に権限を制限しています（`CREATEDB` のみ、スーパーユーザー権限なし）。
- `demo.sql` はバイオインフォマティクス演習用の `demo` データベースを再作成します。
- `setting.sql` はSQL演習用の `database1` データベースを再作成します。
- 旧イメージや旧ボリュームでPostgreSQLを初期化済みの場合は、`docker compose up -d --build` の前に `docker compose down -v` でリセットし、権限を絞った `user` ロールを正しく再作成してください。

## PHPページ

コンテナ起動後、次を開いてください。

- [`http://localhost/`](http://localhost/)
- [`http://localhost/postgres.php`](http://localhost/postgres.php)

トップページから PostgreSQL サンプルページへ遷移でき、`postgres.php` で PHP から PostgreSQL へ接続できることを確認できます。

## Next.js の作業フロー

`nextjs` コンテナは開発コンテナとして用意されています。VS Code Remote / Dev Containers で実行中の `nextjs` コンテナに接続し、`/app` で作業してください。

コンテナ内で次を実行します。

```powershell
cp .env.example .env
npm install
npm run dev
```

その後、次を開いてください。

- [`http://localhost:3000/`](http://localhost:3000/)


## トラブルシューティング

### PostgreSQL は起動しているが演習用DBがない

`demo.sql` と `setting.sql` は手動手順です。`demo` または `database1` が存在しない場合は、`docker compose exec postgres ... -f /home/user/SQL/...` の2コマンドを再実行してください。

PostgreSQLボリュームを削除せずにコンテナだけ再作成した場合、Dockerは旧DB状態を保持します。
これには旧ロール定義も含まれるため、権限変更後は `docker compose down -v` でリセットするか、PostgreSQL上でロール設定を手動で再適用してください。

### 3000番ポートで Next.js が応答しない

`nextjs` コンテナは起動して待機しますが、VS Code Remote で接続して `.env` 作成、パッケージインストール、次の実行を行うまでアプリは応答しません。

```powershell
npm run dev
```


### ポート競合エラー

このプロジェクトは次のホストポートを前提にしています。

- PHP: `127.0.0.1:80`
- Next.js: `127.0.0.1:3000`
- PostgreSQL: `127.0.0.1:5432`

`docker compose up -d` がポート使用中で失敗する場合は、そのポートを使っている別サービスを停止するか、`docker-compose.yml` の公開ポート設定を変更してから再実行してください。
