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

## Installation and Usage

You need :

- **Docker and docker-compose** command
- A sudoer user to run the command or the possibility to add your user to a 'docker' group

You can build the PHP image using :
`docker build -t php-composer-symfony-dev ./symfony`

You can build the Node image using :
`docker build -t node-npm-angular-dev ./angular`

It contains the installation of Composer and Symfony CLI on a PHP Apache base with some modules and configuration for developping a Symfony Application.

You can run all containers with `docker-compose up -d` and check the status of running container with `docker-compose ps` (healtchecks are enabled).

Access the symfony application on [http://localhost:8000](http://localhost:8000) and add `/api` to see the swagger interface.

The Database runs on PotsgreSQL 17 (alpine). You can create the database and run migrations using Symfony.
Enter the bash (used the default non-root user), of the Symfony app using :
`docker-compose exec php bash`

You have access to Symfony CLI, Composer and PHP (bin/console) command from the 'php' container.

Follow logs of 'php' or 'db' container using :
`docker-compose logs --follow --timestamps --tail=100 php|db|node`

Adminer is also available at [http://localhost:8080](http://localhost:8080) for accessing the Database throught an UI (equivalent to PGAdmin or PHPMyAdmin but more versatile).

For Angular in Node container, you can delete '.angular' folder and restart the container in order to rerun 'ng serve' from clean state in case of build problems.
Note that 'ng serve' exposed the 'host 0.0.0.0' from container in order to be accessible from the host's browser.
Also, in Angular app, use URL of the Symfony API like seen by your host because angular is running in the host's browser and cannot know 'php' name from the docker-compose service (unlike 'db' in symfony database_url).

## Permissions

If you use Linux (Ubuntu in my case), you can have problems with permissions between container and host when saving files bind to a volume.

The default UID and GID is 1000 for the current host user and it has to match the one used in the container (for rootless containers).
So you can see that in Dockerfile, I have create and set permissions for the UID 1000 and GID 1000.

You can check the UID and GID with `id -u` and `id -g` (host or container).
