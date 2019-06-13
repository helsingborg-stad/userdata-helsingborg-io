const { client, extractQueryParts } = require('../../db/db.client');

const Persons = () => client('persons');

const reset = () => Persons()
  .truncate();

const query = async (params = {}) => {
  const { where, limit } = extractQueryParts(params);

  return Persons()
    .select()
    .where(where)
    .limit(limit || 10);
};

const create = entity => Persons()
  .insert(entity);

module.exports = {
  reset,
  query,
  create,
};
