const express = require('express');
const dal = require('./user.dal');
const pjson = require('../../../package.json');
const { querySchema, postSchema } = require('./user.schema');
const Validator = require('../../middlewares/validator.middleware');


const routes = () => {
  const router = express.Router();

  // Here we register what endpoints we want.
  router.get('/user', async (req, res) => res.json({
    jsonapi: {
      version: '1.0',
      meta: {
        apiVersion: '1',
        build: pjson.version,
        service: pjson.name,
        owner: 'Helsingborg Stad',
        description: pjson.description,
      },
    },
  }));

  router.get('/user/:person_nr', Validator(querySchema, 'params', true), async (req, res) => {
    const response = await dal.read.user(req.params.person_nr);
    return res.json(response);
  });

  router.delete('/user/:person_nr', Validator(querySchema, 'params', true), async (req, res) => {
    const response = await dal.del.user(req.params.person_nr);
    return res.json(response);
  });

  router.put('/user/:person_nr', Validator(postSchema, 'body', true), async (req, res) => {
    const response = await dal.update.user(req.params.person_nr, req.body);
    return res.json(response);
  });

  return router;
};


module.exports = routes;
