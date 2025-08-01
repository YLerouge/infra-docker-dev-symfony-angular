# Symfony app

API using API platform on top of Symfony.

> Used to demonstrate the infra, not a real app.

Create a `.env.local` file (not commited) to swtch to APP_ENV=dev and set APP_SECRET if you need.

Install dependencies using Composer inside the container:

```bash
composer install
```

Create database (use DATABASE_URL from .env so be sure to pass ENV var in docker-compose.yml):

```bash
php bin/console d:d:c
```

Run migrations:

```bash
php bin/console d:m:m
```

Check database schema:

```bash
php bin/console d:s:v
```

Clear cache:

```bash
php bin/console c:c
```

Check for existing routes:

```bash
php bin/console debug:router
```

App is accessible here: [http://localhost:8000](http://localhost:8000)
Swagger is availbale at `/api`.

Run tests using Composer inside the container:

```bash
composer test
```

It runs several command, see composer.json script part:

```json
"test": [
    "php bin/console d:d:d --force --if-exists --env=test",
    "php bin/console d:d:c --if-not-exists --env=test",
    "php bin/console d:s:u --force --env=test",
    "php bin/console c:c --env=test",
    "php bin/phpunit"
]
```
