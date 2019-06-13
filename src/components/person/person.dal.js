const axios = require('axios');
const { responseSchema } = require('./person.schema');
const { validate } = require('../../validation/validation');
const logger = require('../../utils/logger');

const client = axios.create({
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 5000,
});

const convert = (users = []) => users.map(user => ({
  person_id: `person_${user.userId.toString()}`,
}));

const query = async () => {
  try {
    // Fetch data from test api.
    const testApi = 'https://jsonplaceholder.typicode.com/posts';
    const persons = await client
      .get(testApi)
      .then(res => convert(res.data));

    // Validate response against schema
    return await validate(persons, responseSchema);
  } catch (error) {
    logger.error(error);
    throw error;
  }
};

const post = async (body) => {
  try {
    // Fetch data from test api.
    const testApi = 'https://jsonplaceholder.typicode.com/posts';
    const response = await client.post(testApi, body);

    // Validate response against schema
    return await validate(response.data, responseSchema);
  } catch (error) {
    logger.error(error);
    throw error;
  }
};

module.exports = {
  query,
  post,
};
