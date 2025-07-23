# Symfony app

API using API platform on top of Symfony.

> Used to demonstrate the infra, not a real app.

Create a .env.local file (not commited) to swtch to APP_ENV=dev and set APP_SECRET as you need.

Create database (use DATABASE_URL from .env so be sure to pass ENV var in docker-compose.yml):
`php bin/console d:d:c`

Run migrations :
`php bin/console d:m:m`

Check database schema :
`php bin/console d:s:v`

Clear cache :
`php bin/console c:c`

Check for existing routes :
`php bin/console debug:router`

App is accessible here : [http://localhost:8000](http://localhost:8000)
Swagger is availbale at `/api`.
