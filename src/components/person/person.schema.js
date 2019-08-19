const Joi = require('@hapi/joi');
const { id } = require('../../validation/global.schema');

const date = Joi.date();

// Generic Schema.
const genericSchema = Joi.object().keys({
  person_nr: id.required(),
  first_name: Joi.string(),
  last_name: Joi.string(),
  andringstidpunkt: Joi.number(),
  created_at: date.required(),
});

const postSchema = Joi.object().keys({
  person_nr: id.required(),
  first_name: Joi.string(),
  last_name: Joi.string(),
  andringstidpunkt: Joi.number(),
  created_at: date.required(),
});

const putSchema = Joi.object().keys({
  person_nr: id.required(),
  first_name: Joi.string(),
  last_name: Joi.string(),
  andringstidpunkt: Joi.number(),
  created_at: date.required(),
});

const querySchema = Joi.object().keys({
  person_nr: id,
});

const responseSchema = Joi.object().keys({
  person_nr: id.required(),
  first_name: Joi.string(),
  last_name: Joi.string(),
  andringstidpunkt: Joi.number(),
  created_at: date.required(),
});

module.exports = {
  genericSchema,
  querySchema,
  putSchema,
  postSchema,
  responseSchema,
};
