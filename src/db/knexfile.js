// Update with your config settings.
require('dotenv').config();

const { MYSQL_CONNECTION_STRING, MYSQL_CONNECTION_LIMIT } = process.env;

module.exports = {
  development: {
    client: 'mysql',
    connection: MYSQL_CONNECTION_STRING,
    pool: { min: 0, max: Number(MYSQL_CONNECTION_LIMIT) },
    migrations: {
      directory: './src/db/migrations',
    },
    seeds: {
      directory: './src/db/seeds',
    },
  },
  production: {
    client: 'mysql',
    connection: MYSQL_CONNECTION_STRING,
    pool: { min: 0, max: Number(MYSQL_CONNECTION_LIMIT) },
    migrations: {
      directory: './src/db/migrations',
    },
  },
};
