const express = require('express');
const dal = require('./person.dal');
const { postSchema } = require('./person.schema');
const Validator = require('../..//middlewares/validator.middleware');
const { createJsonapiResponse } = require('../../utils/jsonapi');

const routes = () => {
  const router = express.Router();

  // Here we register what endpoints we want.
  router.get('/', async (req, res) => res.json({
    jsonapi: {
      version: '1.0',
      meta: {
        service: 'userdata-helsingborg-io',
        owner: 'Helsingborg Stad',
      },
    },
  }));

  router.get('/:id', async (req, res) => {
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

  router.post('/', Validator(postSchema, 'body', true), async (req, res) => {
    try {
      // Get the parameters from the request
      const { body } = req;

      await dal.createUser(body);

      return res.send('User created successfully.');
    } catch (err) {
      return res.status(err.status || 500).json(err);
    }
  });

  router.delete('/:id', async (req, res) => {
    try {
      // Get the parameters from the request
      const { id } = req.params;

      await dal.deleteUser(id);

      return res.send('User deleted successfully.');
    } catch (err) {
      return res.status(err.status || 500).json(err);
    }
  });

  router.put('/:id', Validator(postSchema, 'body', true), async (req, res) => {
    try {
      // Get the parameters from the request
      const { id } = req.params;
      const { body } = req;

      // Fetch data from another layer.
      await dal.updateUser(id, body);

      return res.send('User information updated successfully.');
    } catch (err) {
      return res.status(err.status || 500).json(err);
    }
  });

  return router;
};


module.exports = routes;
