const bookshelf = require('bookshelf');
const Knex = require('knex');


const { MYSQL_CONNECTION_LIMIT, MYSQL_CONNECTION_STRING } = process.env;

const client = Knex({
  client: 'mysql',
  connection: MYSQL_CONNECTION_STRING,
  pool: { min: 0, max: Number(MYSQL_CONNECTION_LIMIT) },
});

module.exports = {
  bookshelf: bookshelf(client),
  client,
};
