const Joi = require('@hapi/joi');
const { id } = require('../../validation/global.schema');

const date = Joi.date();

// Generic Schema.
const genericSchema = Joi.object().keys({
  person_nr: Joi.number().required(),
  first_name: Joi.string(),
  last_name: Joi.string(),
  email: Joi.string().email().lowercase().required(),
  device_id: Joi.string(),
  telefon_nr: Joi.string(),
  post_nr: Joi.number(),
  post_ort: Joi.string(),
  adress: Joi.string(),
  updated_at: Joi.date(),
  created_at: date.required(),
});

const postSchema = Joi.object().keys({
  person_nr: id.required(),
  first_name: Joi.string(),
  last_name: Joi.string(),
  updated_at: Joi.number(),
  created_at: date.required(),
});

const querySchema = Joi.object().keys({
  person_nr: Joi.number().required(),
});

const responseSchema = Joi.object().keys({
  person_nr: id.required(),
  first_name: Joi.string(),
  last_name: Joi.string(),
  updated_at: Joi.date(),
  created_at: date.required(),
});

module.exports = {
  genericSchema,
  querySchema,
  postSchema,
  responseSchema,
};
