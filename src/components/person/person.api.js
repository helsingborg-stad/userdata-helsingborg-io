const express = require('express');
const dal = require('./person.dal');
const Persons = require('./person.db');
const { postSchema } = require('./person.schema');
const Validator = require('../..//middlewares/validator.middleware');

const routes = () => {
  const router = express.Router();

  // // Here we register what endpoints we want.
  // router.get('/fake/:id', async (req, res) => {
  //   try {
  //     // Get the parameters from the request
  //     const { id } = req.params;

  //     // Fetch data from another layer.
  //     const response = await dal.fetch(id);

  //     // Convert response to json before sending it.
  //     return res.json(response);
  //   } catch (err) {
  //     // Send back error in json.
  //     return res.status(err.status || 500).json(err);
  //   }
  // });

  // router.get('/fake', Validator(querySchema, 'query', true), async (req, res) => {
  //   try {
  //     // Fetch data from another layer.
  //     const response = await dal.query();

  //     // Convert response to json before sending it.
  //     return res.json(response);
  //   } catch (err) {
  //     // Send back error in json.
  //     return res.status(err.status || 500).json(err);
  //   }
  // });

  // router.post('/fake', Validator(postSchema, 'body', true), async (req, res) => {
  //   try {
  //     const response = await dal.post(req.body);

  //     return res.json(response);
  //   } catch (err) {
  //     return res.status(err.status || 500).json(err);
  //   }
  // });

  router.get('/:id', async (req, res) => {
    try {
      // Get the parameters from the request
      const { id } = req.params;
      const result = await dal.getPerson({ id });
      return res.json(result);
    } catch (err) {
      // Send back error in json.
      return res.status(err.status || 500).json(err);
    }
  });

  router.post('/', Validator(postSchema, 'body', true), async (req, res) => {
    try {
      const { body } = req;
      await Persons.create(body);

      return res.send('Person created successfully.');
    } catch (err) {
      return res.status(err.status || 500).json(err);
    }
  });

  return router;
};

module.exports = routes;
