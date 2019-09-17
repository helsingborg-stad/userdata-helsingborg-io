const axios = require('axios');
const https = require('https');
const fs = require('fs');
const parser = require('xml2json');
const config = require('config');

const getRequestXml = (id) => {
  const orderNumber = config.get('SERVER.OrderNr');
  const orgNumber = config.get('SERVER.OrgNr');
  const navetXmlEndpoint = config.get('SERVER.navetXmlEndpoint');

  return (`<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:v1="${navetXmlEndpoint}">
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
    pfx: fs.readFileSync(config.get('SERVER.Pfx')),
    passphrase: config.get('SERVER.passphrase'),
  }),
  headers: {
    'Content-Type': 'text/xml;charset=UTF-8',
  },
});


const getUserFromNavet = async (id) => {
  const navetEndpoint = config.get('SERVER.navetEndpoint');
  const xml = getRequestXml(id);

  try {
    const res = await axiosClient.post(navetEndpoint, xml);
    if (res.data) {
      const resParsed = await parseJSON(res.data);
      return resParsed.Folkbokforingspost;
    }
    return ('data is empty');
  } catch (error) {
    return parseJSONError(error.response.data);
  }
};

const getUser = async (request) => {
  const user = await getUserFromNavet(request.id);
  // Persons.parseNavetData();
  return {
    attributes: {
      id: request.id,
      ...user,
    },
  };
};

module.exports = {
  getUser,
};
