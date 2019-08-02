const express = require('express');
const config = require('config');
const pino = require('express-pino-logger');
const swaggerUi = require('swagger-ui-express');
const bodyParser = require('body-parser');
const swaggerDocument = require('../swagger/swagger.js');
const routes = require('./components/person/person.api');
const logger = require('./utils/logger');

const app = express();

/**
 * Config
 */
const SERVER_PORT = config.get('SERVER.PORT');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Request logging
app.use(pino({ logger }));

// Add routes to the app.
// app.get('/', (req, res) => res.send('User Data Information API!'));
app.use(routes());

// Swagger for documenting the api, access through localhost:xxxx/api-docs.
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

/**
 * Start
 */

// Listen on port specfied in env-file.
const server = app.listen(SERVER_PORT,
  () => logger.info(`Example app listening on port ${SERVER_PORT}!`));

// Export server to use it in tests.
module.exports = server;
