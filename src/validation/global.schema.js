const Joi = require('@hapi/joi');

// Write all your general Joi-specifications here so they can be imported to all schemas.
const id = Joi.string().trim().regex(/^[0-9]{12}$/);
const limit = Joi.number().min(1).max(100).default(10);

module.exports = {
  id,
  limit,
};
