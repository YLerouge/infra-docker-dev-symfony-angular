# Symfony app

API using API platform on top of Symfony.

> Used to demonstrate the infra, not a real app.

Create a `.env.local` file (not commited) to swtch to APP_ENV=dev and set APP_SECRET if you need.

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

**@TODO**: Add tests and PHPUNIT dependency to the Dockerfile.
Really useful if you add custom code in addition to the standard API of API Platform.
