const createLinksObject = req => ({
  self: `${req.protocol}://${req.get('host')}${req.originalUrl}`,
});

const createRelationshipsObject = (resourceUrl, relations) => {
  const relationships = {};

  // eslint-disable-next-line array-callback-return
  Object.keys(relations).map((key) => {
    const relation = relations[key];

    if (relation.length > 0) {
      relationships[key] = {
        links: { self: `${resourceUrl}/relationships/${key}`, related: `${resourceUrl}/${key}` },
        data: [],
      };
      relationships[key].data = relation.map(item => ({ type: key, id: item.attributes.id }));
    }
  });

  return relationships;
};

const createDataObject = (req, type, data) => {
  const { id, ...rest } = data.attributes;
  const resourceLinks = createLinksObject(req);
  const resourceData = {
    id,
    type,
    attributes: { ...rest },
    links: { self: resourceLinks.self },
  };

  if (data.relations) {
    const relationships = createRelationshipsObject(resourceLinks.self, data.relations);
    if (Object.keys(relationships).length > 0) {
      resourceData.relationships = relationships;
    }
  }

  return resourceData;
};


const createJsonapiResponse = (req, type, data) => {
  const jsonapiResponse = {};

  if (data.length > 0) {
    jsonapiResponse.data = data.map(item => createDataObject(req, type, item));
  } else {
    jsonapiResponse.data = createDataObject(req, type, data);
  }

  jsonapiResponse.links = createLinksObject(req);


  return jsonapiResponse;
};

module.exports = {
  createJsonapiResponse,
};
