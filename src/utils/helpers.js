const parser = require('xml2json');
const jsonapi = require('../jsonapi');
const logger = require('./logger');

const {
  ORDER_NR,
  ORG_NR,
  NAVET_XML_ENDPOINT,
} = process.env;

const parseXml = id => (`<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:v1="${NAVET_XML_ENDPOINT}">
  <soapenv:Header/>
  <soapenv:Body>
    <v1:PersonpostRequest>
      <v1:Bestallning>
        <v1:OrgNr>${ORG_NR}</v1:OrgNr>
        <v1:BestallningsId>${ORDER_NR}</v1:BestallningsId>
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

const createErrorResponse = async (error, res) => {
  logger.error(error);
  logger.error(error);
  const serializedData = await jsonapi.serializer.serializeError(error);
  return res.status(error.status).json(serializedData);
};

const createSuccessResponse = async (data, res, jsonapiType, converter) => {
  const convertData = await jsonapi.convert[converter](data);
  const serializedData = await jsonapi.serializer.serialize(jsonapiType, convertData);
  return res.json(serializedData);
};

module.exports = {
  parseXml,
  parseJSON,
  parseJSONError,
  createErrorResponse,
  createSuccessResponse,
};
