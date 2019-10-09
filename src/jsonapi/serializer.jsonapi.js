const JSONAPISerializer = require('json-api-serializer');
const userJsonApiSchema = require('./schemas/user.jsonapi');

/**
 * Serializer
 * create a new json-api-serializer with global options for all schemas in jsonapi/schemas.
 * docs can be found at https://github.com/danivek/json-api-serializer
 */

const Serializer = new JSONAPISerializer({
  convertCase: 'snake_case',
  unconvertCase: 'camelCase',
});

/**
 * Register
 * register schemas to serializer imported from jsonapi/schemas.
 */

Serializer.register('user', userJsonApiSchema);

module.exports = Serializer;
