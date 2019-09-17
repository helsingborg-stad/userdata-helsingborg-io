const express = require('express');
const config = require('config');
const pino = require('express-pino-logger');
const swaggerUi = require('swagger-ui-express');
const bodyParser = require('body-parser');
const swaggerDocument = require('../swagger/swagger.js');
const routes = require('./components/person/person.api');
const logger = require('./utils/logger');

// Config
const SERVER_PORT = process.env.PORT || config.get('SERVER.PORT');
const API_BASE = '/api/v1';


// Init App
const app = express();


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Request logging
app.use(pino({ logger }));

// Add routes to the app.
app.get(`${API_BASE}/`, (req, res) => res.send('User Data Information API!'));
app.use(routes());

// Swagger for documenting the api, access through localhost:xxxx/api-docs.
app.use(`${API_BASE}/api-docs`, swaggerUi.serve, swaggerUi.setup(swaggerDocument));

/**
 * Start
 */

// Listen on port specfied in env-file.
const server = app.listen(SERVER_PORT,
  () => logger.info(`User Data api listening on port ${SERVER_PORT}!`));

// Export server to use it in tests.
module.exports = server;
