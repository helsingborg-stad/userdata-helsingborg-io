const express = require('express');
const dal = require('./user.dal');
const { updateUser, deleteUser } = require('./user.db');
const logger = require('../../utils/logger');
const { postSchema } = require('./user.schema');
const Validator = require('../../middlewares/validator.middleware');
const { createJsonapiResponse } = require('../../utils/jsonapi');

const routes = () => {
  const router = express.Router();

  // Here we register what endpoints we want.
  router.get('/user', async (req, res) => res.json({
    jsonapi: {
      version: '1.0',
      meta: {
        service: 'userdata-helsingborg-io',
        owner: 'Helsingborg Stad',
      },
    },
  }));

  router.get('/user/:id', async (req, res) => {
    try {
      // Get the parameters from the request
      const { id } = req.params;
      // Fetch data from another layer.
      const data = await dal.getUser({ id });
      const response = await createJsonapiResponse(req, 'users', data);
      // Convert response to json before sending it.
      return res.json(response);
    } catch (err) {
      // Send back error in json.
      return res.status(err.status || 500).json(err);
    }
  });

  router.delete('/user/:id', async (req, res) => {
    try {
      // Get the parameters from the request
      const { id } = req.params;

      await deleteUser(id);

      return res.send('User deleted successfully.');
    } catch (err) {
      return res.status(err.status || 500).json(err);
    }
  });

  router.put('/user/:id', async (req, res) => {
    try {
      // Get the parameters from the request
      const { id } = req.params;
      const { body } = req;

      // Fetch data from another layer.
      const data = await updateUser(id, body);

      logger.info('User information updated successfully.');
      const response = await createJsonapiResponse(req, 'users', data);
      // Convert response to json before sending it.
      return res.json(response);
    } catch (err) {
      return res.status(err.status || 500).json(err);
    }
  });

  return router;
};


module.exports = routes;
