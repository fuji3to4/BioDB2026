FROM php:8.3-apache-bookworm

ENV TZ=Asia/Tokyo

COPY php.ini /usr/local/etc/php/
COPY 000-default.conf /etc/apache2/sites-available/000-default.conf

RUN apt-get update \
    && apt-get install -y libpq-dev libonig-dev \
    && docker-php-ext-install pdo_pgsql pgsql mbstring \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /html
RUN rm -rf /var/www/html
RUN ln -s /html /var/www/html
