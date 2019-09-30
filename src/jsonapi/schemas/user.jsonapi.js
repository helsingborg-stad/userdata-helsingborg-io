const { BASE_URL } = process.env;

const userJsonApiSchema = {
  id: 'id',
  links: {
    self(data) {
      return `${BASE_URL}/users/${data.person_nr}`;
    },
  },
  topLevelMeta(data, extraData) {
    return {
      count: extraData.count,
      total: data.length,
    };
  },
  topLevelLinks: {
    self: '/users/',
  },
};

module.exports = userJsonApiSchema;
