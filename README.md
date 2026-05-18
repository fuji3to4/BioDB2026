[en](README_en.md) | [ja](README.md)

# BioDB2026 演習環境

このリポジトリは、Docker Compose上でPostgreSQL、PHP、Next.jsを動かすための演習環境です。


## コンテナの起動

```powershell
docker compose up -d
```

これにより次が起動します。

- PostgreSQL: `127.0.0.1:5432`
- PHP/Apache: `http://localhost/`
- `nextjs`コンテナ: `127.0.0.1:3000` を公開

`docker compose up -d` だけでは Next.js の開発サーバーは起動しません。実行中の `nextjs` コンテナに接続し、以下の手動手順を完了するまで `http://localhost:3000/` は利用できません。

## PostgreSQL の手動セットアップ

マウントされるSQLファイルは、**演習用の手動セットアップ手順**です。`docker compose up -d` では自動適用されません。

サンプルDBが必要なときは、リポジトリルートで次を実行してください。

```powershell
docker compose exec postgres psql -U user -d postgres -f /home/user/SQL/demo.sql
docker compose exec postgres psql -U user -d postgres -f /home/user/SQL/setting.sql
```

もしくは、以下の手順で`biodb-postgres`コンテナに接続してから、`pgsql`コマンドにてSQLファイルを適用してください。

```powershell
docker exec -it biodb-postgres bash
```

```bash
psql -U user -d postgres -f demo.sql
psql -U user -d postgres -f setting.sql
```

- `user` ロールは演習フロー向けに意図的に権限を制限しています（`CREATEDB` のみ、スーパーユーザー権限なし）。
- `demo.sql` はバイオインフォマティクス演習用の `demo` データベースを再作成します。
- `setting.sql` はSQL演習用の `database1` データベースを再作成します。


## PHPページ

コンテナ起動後、次を開いてください。

- [`http://localhost/`](http://localhost/)
- [`http://localhost/sample.php`](http://localhost/sample.php)

トップページから PostgreSQL サンプルページへ遷移でき、`sample.php` で PHP から PostgreSQL へ接続できることを確認できます。

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

※`npm run dev`は開発用にNext.jsを起動させます。アクセスする度にコードの変更が反映されるため、開発中はこのコマンドを実行したままで大丈夫です。ただしコンパイルが毎回入るので若干重くなります。
以下のコマンドは本番用にNext.jsをビルドして起動させるコマンドです。一度ビルドしてしまえば、コードの変更があっても再度ビルドしない限り反映されないため、ウェブアプリを軽く動かすことができます。

```bash
npm run build
npm start
```


## (Optional) Next.js のローカル開発環境での実行
※提出時に./node_modulesを削除してもらう必要があるかもしれません。

- Next.js をローカルで実行したい場合は、次の手順を実行してください。

[Node.js公式サイト](https://nodejs.org/)からLTSバージョンをインストールする。

- リポジトリルート（./my-app）で次を実行する。

```bash
cp .env.example .env
npm install
npm run dev
```

- ブラウザで [`http://localhost:3000/`](http://localhost:3000/) を開く。


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
