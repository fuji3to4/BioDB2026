# Advanced CourseのPHPアプリケーションをRenderでホストするためのDockerfile
# 公式のPHP+Apacheイメージを使用（PHP 8.2の場合）
FROM php:8.2-apache

# Neon（PostgreSQL）に接続するためのPHP拡張モジュールをインストール
RUN apt-get update && apt-get install -y libpq-dev \
    && docker-php-ext-install pdo pdo_pgsql pgsql

# あなたのPHPソースコードをApacheの公開ディレクトリにコピー
COPY . /var/www/html/

# ApacheのRewriteモジュールを有効化（.htaccessでリライトを使う場合）
RUN a2enmod rewrite

# ポート80番（Renderがコンテナと通信するポート）を指定
EXPOSE 80