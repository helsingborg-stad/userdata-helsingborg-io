const { client } = require('../../db/db.client');

const Persons = () => client('persons');

const reset = () => Persons()
  .truncate();

const query = async where => Persons()
  .select()
  .where(where)
  .orderBy('created_at', 'desc');

const create = entity => Persons()
  .insert(entity);

module.exports = {
  reset,
  query,
  create,
};
