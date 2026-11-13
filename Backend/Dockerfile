FROM php:8.4-cli-alpine

RUN apk add --no-cache unzip libzip-dev icu-dev && docker-php-ext-install pdo_mysql zip intl bcmath

COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html

COPY . .

RUN composer install

EXPOSE 8000
CMD php artisan migrate --force && php artisan db:seed --force && php artisan serve --host=0.0.0.0 --port=8000
