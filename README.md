# Develop in PHP Symfony and Angular from docker containers

The purpose of this repository is to allow devs to develop in a docker environment without relying on multiple installations and obsolete tools.

Indeed, in many teams, each member rely on its own environment which can differs from one another. The goal here is to contrain versions and easily update tools for everyone at once when needed.

It uses docker-compose to run multi-container in the same network.
You don't need to have other tools than an IDE and Docker (docker-compose) to develop your app !

It contains:

- A **PHP Symfony Backend** (composer) container wich serve an API throught Apache Server
- A **PostgreSQL database** container for saving data of the API
- A **Frontend Angular** (Node) container which can connect to the API and use 'ng serve' to expose the SPA
- An **Adminer** container to connect to database using a friendly UI (compatible with multiple databases)

> It shoulds only be used for development and not production. Secrets are fake and not usable for other purpose than development.

## Installation and Usage

You need :

- **Docker and docker-compose** command
- A sudoer user to run the command or the possibility to add your user to a 'docker' group (linux)

You can run all containers with:

```bash
docker-compose up -d
```

You can specify an environment file with `--env-file` if you want to customize or create multiple configurations:

```bash
docker-compose --env-file .env.local up -d
```

Check the status of running container with:

```bash
docker-compose ps
```

> There are Healtchchecks and dependencies between containers to help identifying problems and run everything in order

### Symfony

You can build the PHP image using:

```bash
docker build -t php-composer-symfony-dev ./symfony
```

It contains the installation of Composer and Symfony CLI on a PHP Apache base with some modules and configuration for developping a Symfony Application.

Access the symfony application on [http://localhost:8000](http://localhost:8000) and add `/api` to see the swagger interface.

Enter the bash (used the default non-root user) of the Symfony app using:

```bash
docker-compose exec php bash
```

You have access to Symfony CLI, Composer and PHP (bin/console) command from the 'php' container.

Follow logs of 'php' container using:

```bash
docker-compose logs --follow --timestamps --tail=100 php
```

See [the symfony README](./symfony/README.md) for more related command.

### Angular

You can build the Node image using:

```bash
docker build -t node-npm-angular-dev ./angular
```

It contains Node (with NPM), the Angular CLI and a chromium used for tests (feel free to add Yarn instead of NPM if you prefer).

Access the app via [http://localhost:4200](http://localhost:4200).

Enter the bash (used the default non-root user) of the Angular app using:

```bash
docker-compose exec node bash
```

You can run test with `npm run test` for example or use `ng` command to generate code.

Note that 'ng serve' run automatically when the container start.
It exposed the 'host 0.0.0.0' from container in order to be accessible from the host's browser.

Also, in the Angular app, the URL of the Symfony API used is like seen by your host (localhost:8000).
This because Angular application runs in the host's browser and doesn't know 'php' service name from the docker-compose file (unlike 'db' in symfony DATABASE_URL).

> For Angular in Node container, you can delete '.angular' folder and restart the container in order to rerun 'ng serve' from a clean state in case you're experiencing build problems.

Follow logs of 'node' container using:

```bash
docker-compose logs --follow --timestamps --tail=100 node
```

See [the angular README](./angular/README.md) for more related command.

### PostgreSQL

The Database runs on PotsgreSQL 17 (alpine). You can create the database and run migrations using Symfony in 'php' container.

Adminer is also available at [http://localhost:8080](http://localhost:8080) for accessing the Database throught an UI (equivalent to PGAdmin or PHPMyAdmin but more versatile).

Follow logs of 'db' container using:

```bash
docker-compose logs --follow --timestamps --tail=100 db
```

## Permissions

If you use Linux (Ubuntu in my case), you can have problems with permissions between container and host when saving files bind to a volume.

The default UID and GID is 1000 for the current host user and it has to match the one used in the container (for rootless containers).
So you can see that in Dockerfile, I create and set permissions for the UID 1000 and GID 1000.

> You can check the UID and GID with `id -u` and `id -g` (host or container).
