const Joi = require('@hapi/joi');

// Write all your general Joi-specifications here so they can be imported to all schemas.
const id = Joi.string().min(5).max(24);
const limit = Joi.number().min(1).max(100).default(10);

module.exports = {
  id,
  limit,
};
