# Barista Project

# Environment vars

This project uses the following environment variables:

| Name                | Description                                         | Default Value          |
| ------------------- | --------------------------------------------------- | ---------------------- |
| PORT                | Custom port that the application will be running on | 3000                   |
| SERVICE_NAME        | The name of the current service                     | Barista Service  |
| BASE_URL            | Project base url                                    | /api/v1                |
| DEFAULT_PAGE_SIZE   | Default page size for the pagination                | 5                      |
| DEFAULT_PAGE_NUMBER | Default page number for the pagination              | 0                      |
| NODE_ENV            | Current environment                                 | dev                    |
| DB_TYPE        | Database type                                       | postgres               |
| DB_HOST        | Database server host                                | localhost              |
| DB_PORT        | Database port                                       | 5432                   |
| DB_USERNAME    | Database username                                   | postgres               |
| DB_PASSWORD    | Database password                                   | postgres               |
| DB_INSTANCE    | Database name                                       | barista_db                |

# Pre-requisites [Development]

- Install [Node.js](https://nodejs.org/en/)
- Install typorm globally

```
npm install typeorm -g --save
```

# Getting started

- Clone the repository

```
https://github.com/Minahany79/Barista
```

- Install dependencies

```
cd Barista
npm install
```

- Build and run the project

```
docker-compose build
docker-compose up
```

- Applying DB migrations

```
npm run migration:run
```

- Build and run the project (development)

```
npm run start
```

Navigate to `http://localhost:3000`

- Testing the application

```
http://localhost:3000/api/v1/misc/ping
Expected Response:
"PONG !! from Barista - Mon Aug 22 2022 20:06:13 GMT+0200 (Eastern European Standard Time)"
```

## Project Structure

The folder structure of this app is explained below:

| Name                | Description                                                           |
| ------------------- | --------------------------------------------------------------------- |
| **node_modules**    | Contains all npm dependencies                                         |
| **src**             | Contains source code that will be compiled to the dist dir            |
| **tests**           | Contains the projects tests                                           |
| **src/config**      | Contains project configurations i.e. database connection & migrations |
| **src/domains**     | Contains the project domains (features)                               |
| **src/routes**      | Contain all express routes                                            |
| **src**/server.js   | node js server configurations                                         |
| **src**/app.js      | Entry point to express app                                            |
| dockerfile.be       | backend docker image                                                  |
| dockerfile.postgres | database docker image                                                 |
| docker-compose.yml  | docker compose file                                                   |
| package.json        | Contains npm dependencies as well as build scripts                    |
| .env.local          | environment file                                                      |
| global.d.ts         | environment file types                                                |
| config.ts           | project configurations module                                         |
