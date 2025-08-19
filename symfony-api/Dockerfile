FROM composer:latest AS composer

FROM php:8.4-apache

### Uncomment and adapt this if you have trouble with certificate and VPN/Proxy ###
# Copy certificate from local
# COPY ["Zscaler Root CA.crt","/etc/ssl/certs/Zscaler Root CA.crt"]

# # Set certificate for PHP, wget and curl
# RUN echo "openssl.cafile = '/etc/ssl/certs/Zscaler Root CA.crt'" > /usr/local/etc/php/php.ini
# RUN echo "ca_certificate=/etc/ssl/certs/Zscaler Root CA.crt" >> $HOME/.wgetrc
# RUN echo "cacert=\"/etc/ssl/certs/Zscaler Root CA.crt\"" >> $HOME/.curlrc

# Install system dependencies
RUN apt-get update && apt-get install -y \
    unzip \
    git \
    wget \
    libicu-dev \
    libpq-dev \
    && pecl install xdebug \
    && docker-php-ext-enable xdebug \
    && docker-php-ext-install intl \
    && docker-php-ext-install pdo_pgsql pgsql \
    && rm -rf /var/lib/apt/lists/*

# Install XDEBUG (without PECL if needed)
# RUN cd /tmp \
#     && git config --global http.sslVerify false \
#     && git clone https://github.com/xdebug/xdebug.git \
#     && cd xdebug \
#     && git checkout xdebug_3_4 \
#     && phpize \
#     && ./configure --enable-xdebug \
#     && make \
#     && make install \
#     && rm -rf /tmp/xdebug \
#     && docker-php-ext-enable xdebug

# Install Composer from official image
COPY --from=composer /usr/bin/composer /usr/bin/composer

# Install Symfony CLI
RUN wget https://get.symfony.com/cli/installer -O - | bash \
    && mv /root/.symfony5/bin/symfony /usr/local/bin/symfony

# Disable short_open_tag in php.ini
RUN echo "short_open_tag = Off" > /usr/local/etc/php/conf.d/99-short_open_tag.ini

# Xdebug configuration
RUN echo "zend_extension=$(find /usr/local/lib/php/extensions/ -name xdebug.so)" > /usr/local/etc/php/conf.d/docker-php-ext-xdebug.ini \
    && echo "xdebug.mode=develop,debug,coverage" >> /usr/local/etc/php/conf.d/docker-php-ext-xdebug.ini

# Change Apache DocumentRoot to /var/www/html/public
RUN sed -i 's|DocumentRoot /var/www/html|DocumentRoot /var/www/html/public|g' /etc/apache2/sites-available/000-default.conf

# Allow .htaccess overrides in /var/www/html/public
RUN echo '<Directory /var/www/html/public>\n    AllowOverride None\n   Require all granted\n     FallbackResource /index.php\n</Directory>' > /etc/apache2/conf-available/allow-override.conf \
    && a2enconf allow-override

# Add group local and name to pre-existing user 1000
RUN groupadd --gid 1000 local \
    && useradd --uid 1000 --gid 1000 -m local

# Set permissions for /var/www/html
RUN chown -R 1000:1000 /var/www \
    && chmod -R 755 /var/www

USER 1000

# Set working directory
WORKDIR /var/www/html

# Expose Apache port
EXPOSE 80

# Apache starts automatically as the container's CMD
