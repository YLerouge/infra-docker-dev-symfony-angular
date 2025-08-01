FROM node:lts

# Install system dependencies
RUN apt-get update && apt-get install -y \
    unzip \
    git \
    wget \
    chromium \
    && rm -rf /var/lib/apt/lists/*

RUN npm install -g @angular/cli@20

# Can be useful to chromium when running ng test
RUN mkdir -p ~/.config \
    && chown -R 1000:1000 ~/.config

# Set permissions for /var/www/html
# The base image has already a user with UID and GID 1000 (node user)
RUN mkdir -p /var/www/html \
    && chown -R 1000:1000 /var/www \
    && chmod -R 755 /var/www

USER 1000

WORKDIR /var/www/html

EXPOSE 4200

# Allow Chromium to run (set HOME and disable sandbox for non-root)
ENV CHROME_BIN=/usr/bin/chromium

CMD ["ng", "serve", "--host", "0.0.0.0"]
