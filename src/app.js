require('dotenv').config();
const express = require('express');
const pino = require('express-pino-logger');
const swaggerUi = require('swagger-ui-express');
const bodyParser = require('body-parser');
const jsonSchemaRefParser = require('json-schema-ref-parser');
const swaggerDocument = require('../swagger/swagger.js');
const routes = require('./components/user/user.api');
const logger = require('./utils/logger');

// Init App
const app = express();
const V1BASEPATH = '/api/v1';

// Config
const { PORT } = process.env;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Request logging
app.use(pino({ logger }));

// Add root route for version information of the app.
app.get('/', (req, res) => res.send({
  jsonapi: {
    version: '1.0',
    meta: {
      versions: [
        {
          version: '1',
          basepath: '/api/v1/',
          state: 'beta',
          releasedate: null,
        },
      ],
      build: '1.0.0',
      service: 'userData-helsingborg-io',
      owner: 'Helsingborg Stad',
      description: 'Userdata service in helsingborg-io platform. Provides user Data information about example.',
    },
  },
}));

// Add routes to the app.
app.use(V1BASEPATH, routes());

// Swagger for documenting the api, access through localhost:xxxx/api-docs.
jsonSchemaRefParser.dereference(swaggerDocument, (err, schema) => {
  if (err) {
    logger.error(err);
  } else {
    // `schema` is just a normal JavaScript object that contains your entire JSON Schema,
    // including referenced files, combined into a single object
    app.use(`${V1BASEPATH}/api-docs`, swaggerUi.serve, swaggerUi.setup(schema));
  }
});

/**
 * Start
 */

// Listen on port specfied in env-file.
const server = app.listen(PORT,
  () => logger.info(`User Data api listening on port ${PORT}!`));

// Export server to use it in tests.
module.exports = server;
