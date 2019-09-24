const axios = require('axios');
const https = require('https');
const fs = require('fs');
const parser = require('xml2json');
const { ResourceNotFoundError, InternalServerError } = require('../../utils/error');
const { queryUsers, createUser } = require('./user.db');

const {
  OrderNr,
  OrgNr,
  navetXmlEndpoint,
  navetEndpoint,
  Pfx,
  passphrase,
} = process.env;

const getRequestXml = id => (`<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:v1="${navetXmlEndpoint}">
  <soapenv:Header/>
  <soapenv:Body>
    <v1:PersonpostRequest>
      <v1:Bestallning>
        <v1:OrgNr>${OrgNr}</v1:OrgNr>
        <v1:BestallningsId>${OrderNr}</v1:BestallningsId>
      </v1:Bestallning>
      <v1:PersonId>${id}</v1:PersonId>
    </v1:PersonpostRequest>
  </soapenv:Body>
</soapenv:Envelope>`);

const parseJSON = input => new Promise(
  (resolve, reject) => {
    try {
      const posts = input.split('Folkbokforingsposter>');

      // If result has any posts the length will be bigger then 2.
      if (posts.length >= 2) {
        const parsedTwice = posts[1].split('</ns0:');
        const resParsed = parser.toJson(parsedTwice[0]);
        resolve(JSON.parse(resParsed));
      }
      resolve(input);
    } catch (error) {
      reject(error);
    }
  },
);

const parseJSONError = input => new Promise(
  (resolve, reject) => {
    try {
      const parsedOnce = input.split('<faultstring>');
      const parsedTwice = parsedOnce[1].split('</faultstring>');
      resolve(parsedTwice[0]);
    } catch (error) {
      reject(error);
    }
  },
);

const axiosClient = axios.create({
  httpsAgent: new https.Agent({
    rejectUnauthorized: false,
    pfx: fs.readFileSync(Pfx),
    passphrase,
  }),
  headers: {
    'Content-Type': 'text/xml;charset=UTF-8',
  },
});


const getUserFromNavet = async (id) => {
  const xml = getRequestXml(id);

  try {
    const response = await axiosClient.post(navetEndpoint, xml);
    if (!response || !response.data) throw new ResourceNotFoundError();

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
    throw new InternalServerError(parseJSONError(error.response.data));
  }
};

const getUser = async (request) => {
  const userFromDB = await queryUsers(request.id);
  if (!userFromDB) {
    const user = await getUserFromNavet(request.id);
    await createUser(user);
    const savedUser = await queryUsers(request.id);
    return {
      attributes: {
        id: request.id,
        ...savedUser.attributes,
      },
    };
  }
  return {
    attributes: {
      id: request.id,
      ...userFromDB.attributes,
    },
  };
};

module.exports = {
  getUser,
};
