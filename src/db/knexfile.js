// Update with your config settings.
const config = require('config');
const path = require('path');

const knexConfig = config.util.loadFileConfigs(path.join(__dirname, '/../../config'));
config.util.setModuleDefaults('KNEX', knexConfig);

const MYSQL_HOST = config.get('KNEX.MYSQL.HOST');
const MYSQL_PORT = config.get('KNEX.MYSQL.PORT');
const MYSQL_DB = config.get('KNEX.MYSQL.DB');
const MYSQL_USER = config.get('KNEX.MYSQL.USER');
const MYSQL_PASSWORD = config.get('KNEX.MYSQL.PASSWORD');
const MYSQL_CONNECTION_LIMIT = config.get('KNEX.MYSQL.CONNECTION_LIMIT');

module.exports = {
  development: {
    client: 'mysql',
    connection: {
      host: MYSQL_HOST,
      port: Number(MYSQL_PORT),
      user: MYSQL_USER,
      password: MYSQL_PASSWORD,
      database: MYSQL_DB,
    },
    pool: { min: 0, max: Number(MYSQL_CONNECTION_LIMIT) },
  },
};
