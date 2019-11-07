const axios = require('axios');
const https = require('https');
const fs = require('fs');
const { ResourceNotFoundError } = require('../../utils/error');
const {
  parseXml, parseJSONError, parseJSON, createErrorResponse, createSuccessResponse,
} = require('../../utils/helpers');
const {
  query, create, erase, insert,
} = require('./user.db');

const { NAVET_ENDPOINT, PFX, PASSPHRASE } = process.env;

const axiosClient = axios.create({
  httpsAgent: new https.Agent({
    rejectUnauthorized: false,
    pfx: fs.readFileSync(PFX),
    passphrase: PASSPHRASE,
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
    return new ResourceNotFoundError(await parseJSONError(error.response.data));
  }
};

/**
 * READ USER METHODS
 */

const getUser = async (req, res) => {
  // Write method for fetching user data
  try {
    // retrieve params
    const id = req.params.person_nr;

    // Fetch data from DB.
    const userFromDB = await query(id);
    if (!userFromDB.status) return await createSuccessResponse(userFromDB, res, 'user', 'queryData');

    const userFromNavet = await getUserFromNavet(id);
    if (userFromNavet.status === 404) return createErrorResponse(userFromNavet, res);

    // Save Data i DB
    await create(userFromNavet);
    const savedUser = await query(id);

    // Convert response to json before sending it.
    return await createSuccessResponse(savedUser, res, 'user', 'queryData');
  } catch (error) {
    return createErrorResponse(error, res);
  }
};

const read = {
  user: getUser,
};

/**
 * UPDATE USER METHODS
 */

const updateUser = async (req, res) => {
  // Write method for updating user data
  try {
    // retrieve params
    const id = req.params.person_nr;

    // Update user data to DB
    await insert(id, req.body);

    // Fetch data from DB.
    const data = await query(id);

    // Convert response to json before sending it.
    return await createSuccessResponse(data.attributes, res, 'user', 'queryData');
  } catch (error) {
    return createErrorResponse(error, res);
  }
};

const update = {
  user: updateUser,
};

/**
 * DELETE USER METHODS
 */

const deleteUser = async (req, res) => {
  // Write method for deleting user
  try {
    // retrieve params
    const id = req.params.person_nr;

    // erase data from DB.
    return erase(id);
  } catch (error) {
    return createErrorResponse(error, res);
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
