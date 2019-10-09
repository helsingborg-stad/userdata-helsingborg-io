const Serializer = require('./serializer.jsonapi');
const createObjectFromKnexQuery = require('./convert/knex.jsonapi');
/**
 * Export
 * json-api-serializer
 * helper functions to convert data to serializable objects.
 */
module.exports = {
  serializer: Serializer,
  convert: {
    queryData: createObjectFromKnexQuery,
  },
};
