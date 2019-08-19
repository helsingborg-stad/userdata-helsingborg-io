const axios = require('axios');
const https = require('https');
const fs = require('fs');
const parser = require('xml2json');
const config = require('config');
const DB = require('../person/person.db');

const url = 'https://www2.test.skatteverket.se/na/na_epersondata/V2/personpostXML';

const getRequestXml = (id) => {
  const orderNumber = '00000236-FO01-0001';
  const orgNumber = '162021004748';
  const apiUrl = 'http://xmls.skatteverket.se/se/skatteverket/folkbokforing/na/epersondata/V1';

  return (`<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:v1="${apiUrl}">
  <soapenv:Header/>
  <soapenv:Body>
    <v1:PersonpostRequest>
      <v1:Bestallning>
        <v1:OrgNr>${orgNumber}</v1:OrgNr>
        <v1:BestallningsId>${orderNumber}</v1:BestallningsId>
      </v1:Bestallning>
      <v1:PersonId>${id}</v1:PersonId>
    </v1:PersonpostRequest>
  </soapenv:Body>
</soapenv:Envelope>`);
};

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
    key: fs.readFileSync(config.get('SERVER.komAKey')),
    cert: fs.readFileSync(config.get('SERVER.komACrt')),
    passphrase: config.get('SERVER.passphrase'),
  }),
  headers: {
    'Content-Type': 'text/xml;charset=UTF-8',
  },
});

const getPersonFromDatabase = async (id) => {
  try {
    DB.reset();
    const user = DB.query(id);
    return user;
  } catch (error) {
    return error;
  }
};

const getPersonNavet = async (id) => {
  const xml = getRequestXml(id);

  try {
    const res = await axiosClient.post(url, xml);
    if (res.data) {
      const resParsed = await parseJSON(res.data);
      return resParsed;
    }
    return ('data is empty');
  } catch (error) {
    return parseJSONError(error.response.data);
  }
};

exports.getPerson = async (request) => {
  console.log(request.id);
  const dbUser = await getPersonFromDatabase(request.id);
  console.log(dbUser);
  if (dbUser) {
    return {
      from: 'DB',
      user: dbUser,
    };
  }
  const navetUser = await getPersonNavet(request.id);
  return {
    from: 'Navet',
    user: navetUser,
  };
};
