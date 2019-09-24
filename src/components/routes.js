const express = require('express');

const user = require('./user/user.api');

const routes = () => {
  const router = express.Router();

  // Register route to api-layer.
  router.use('/', user());

  return router;
};


module.exports = routes;
