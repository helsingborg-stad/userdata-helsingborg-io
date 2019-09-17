const config = require('config');

const MYSQL_HOST = config.get('MYSQL.HOST');
const MYSQL_PORT = config.get('MYSQL.PORT');
const MYSQL_DB = config.get('MYSQL.DB');
const MYSQL_USER = config.get('MYSQL.USER');
const MYSQL_PASSWORD = config.get('MYSQL.PASSWORD');
const MYSQL_CONNECTION_LIMIT = config.get('MYSQL.CONNECTION_LIMIT');
const bookshelf = require('bookshelf');

const Knex = require('knex');

const client = Knex({
  client: 'mysql',
  connection: {
    host: MYSQL_HOST,
    port: Number(MYSQL_PORT),
    user: MYSQL_USER,
    password: MYSQL_PASSWORD,
    database: MYSQL_DB,
  },
  pool: { min: 0, max: Number(MYSQL_CONNECTION_LIMIT) },
});

const extractQueryParts = (obj) => {
  const where = obj;
  const { limit } = obj;

  delete where.limit;

  return {
    where,
    limit,
  };
};

module.exports = {
  client,
  extractQueryParts,
  bookshelf: bookshelf(client),
};
