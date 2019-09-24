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

// Config
const { SERVER_PORT } = process.env;
const API_BASE = '/api/v1';

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Request logging
app.use(pino({ logger }));

// Add routes to the app.
app.use(routes());

// Swagger for documenting the api, access through localhost:xxxx/api-docs.
jsonSchemaRefParser.dereference(swaggerDocument, (err, schema) => {
  if (err) {
    logger.error(err);
  } else {
    // `schema` is just a normal JavaScript object that contains your entire JSON Schema,
    // including referenced files, combined into a single object
    app.use(`${API_BASE}/api-docs`, swaggerUi.serve, swaggerUi.setup(schema));
  }
});

/**
 * Start
 */

// Listen on port specfied in env-file.
const server = app.listen(SERVER_PORT,
  () => logger.info(`User Data api listening on port ${SERVER_PORT}!`));

// Export server to use it in tests.
module.exports = server;
