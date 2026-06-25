FROM php:8.3-apache-bookworm

ENV TZ=Asia/Tokyo

COPY php.ini /usr/local/etc/php/
COPY 000-default.conf /etc/apache2/sites-available/000-default.conf

RUN apt-get update \
    && apt-get install -y libpq-dev libonig-dev \
    && docker-php-ext-install pdo_pgsql pgsql mbstring \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Apache最適化: KeepAlive有効化、不要モジュール無効化
RUN a2enmod deflate expires headers rewrite && \
    a2dismod --force status cgid && \
    { \
        echo '<IfModule mpm_prefork_module>'; \
        echo '    StartServers        2'; \
        echo '    MinSpareServers     2'; \
        echo '    MaxSpareServers     5'; \
        echo '    MaxRequestWorkers   50'; \
        echo '    MaxConnectionsPerChild 1000'; \
        echo '</IfModule>'; \
    } > /etc/apache2/conf-available/performance.conf && \
    a2enconf performance

# Dockerfile 側で KeepAlive を有効化（デフォルトで有効なので確認のみ）
RUN sed -i \
    -e 's/^#KeepAlive On/KeepAlive On/' \
    -e 's/^MaxKeepAliveRequests .*/MaxKeepAliveRequests 100/' \
    -e 's/^KeepAliveTimeout .*/KeepAliveTimeout 5/' \
    /etc/apache2/apache2.conf

WORKDIR /html
RUN rm -rf /var/www/html
RUN ln -s /html /var/www/html
