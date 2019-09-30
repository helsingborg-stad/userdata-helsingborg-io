const axios = require('axios');
const https = require('https');
const fs = require('fs');
const logger = require('../../utils/logger');
const { ResourceNotFoundError, InternalServerError } = require('../../utils/error');
const { parseXml, parseJSONError, parseJSON } = require('../../utils/helpers');
const jsonapi = require('../../jsonapi');
const {
  query, create,
  erase, insert,
} = require('./user.db');

const {
  NAVET_ENDPOINT,
  PFX,
  PASSPHRASE,
} = process.env;

const axiosClient = axios.create({
  httpsAgent: new https.Agent({
    rejectUnauthorized: false,
    pfx: fs.readFileSync(PFX),
    PASSPHRASE,
  }),
  headers: {
    'Content-Type': 'text/xml;charset=UTF-8',
  },
});

/**
 * READ METHODS FOR USER DATA FROM NAVET
 */
const getUserFromNavet = async (id) => {
  const xml = parseXml(id);

  try {
    const response = await axiosClient.post(NAVET_ENDPOINT, xml);
    if (!response || !response.data) return ResourceNotFoundError();

    const data = await parseJSON(response.data);
    const res = data.Folkbokforingspost;

    const user = {
      person_nr: res.Personpost.PersonId.PersonNr,
      first_name: res.Personpost.Namn.Fornamn,
      last_name: res.Personpost.Namn.Efternamn,
      post_nr: res.Personpost.Adresser.Folkbokforingsadress.PostNr,
      post_ort: res.Personpost.Adresser.Folkbokforingsadress.Postort,
      adress: res.Personpost.Adresser.Folkbokforingsadress.Utdelningsadress2,
    };
    return user;
  } catch (error) {
    return new InternalServerError(parseJSONError(error.response.data));
  }
};


/**
 * READ USER METHODS
 */

const getUser = async (id) => {
  // Write method for fetching user data
  try {
    // Fetch data from DB.
    const userFromDB = await query(id);

    if (!userFromDB) {
      // Fetch data from Navet.
      const user = await getUserFromNavet(id);

      // Save Data i DB
      await create(user);
      const savedUser = await query(id);

      return jsonapi.serializer.serialize('user', savedUser.attributes);
    }

    return jsonapi.serializer.serialize('user', userFromDB.attributes);
  } catch (error) {
    logger.error(error);
    const errorResponse = await jsonapi.serializer.serializeError(error);
    return errorResponse;
  }
};

const read = {
  user: getUser,
};


/**
 * UPDATE USER METHODS
 */

const updateUser = async (id, body) => {
  // Write method for updating user data
  try {
    // Update user data to DB
    await insert(id, body);

    // Fetch data from DB.
    const data = await query(id);

    // Convert response to json before sending it.
    return jsonapi.serializer.serialize('user', data.attributes);
  } catch (error) {
    logger.error(error);
    const errorResponse = await jsonapi.serializer.serializeError(error);
    return errorResponse;
  }
};

const update = {
  user: updateUser,
};


/**
 * DELETE USER METHODS
 */

const deleteUser = async (id) => {
  // Write method for deleting user
  try {
    return erase(id);
  } catch (error) {
    logger.error(error);
    const errorResponse = await jsonapi.serializer.serializeError(error);
    return errorResponse;
  }
};

const del = {
  ser: deleteUser,
};


module.exports = {
  read,
  update,
  del,
};
