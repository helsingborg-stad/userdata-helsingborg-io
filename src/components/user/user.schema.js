const Joi = require('@hapi/joi');
const { id } = require('../../validation/global.schema');

const postSchema = Joi.object().keys({
  person_nr: id.required(),
  first_name: Joi.string(),
  last_name: Joi.string(),
  email: Joi.string().email().lowercase(),
  telephone_nr: Joi.string(),
  device_id: Joi.string(),
  post_nr: Joi.number(),
  post_ort: Joi.string(),
  adress: Joi.string(),
  updated_at: Joi.date(),
  created_at: Joi.date(),
});

const putSchema = Joi.object().keys({
  first_name: Joi.string(),
  last_name: Joi.string(),
  email: Joi.string().email().lowercase(),
  telephone_nr: Joi.string(),
  device_id: Joi.string(),
  post_nr: Joi.number(),
  post_ort: Joi.string(),
  adress: Joi.string(),
  updated_at: Joi.date(),
  created_at: Joi.date(),
});

const querySchema = Joi.object().keys({
  person_nr: id.required(),
});

module.exports = {
  querySchema,
  postSchema,
  putSchema,
};
