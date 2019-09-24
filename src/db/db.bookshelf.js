const { bookshelf } = require('./db.client');

bookshelf.plugin('registry');

const Users = bookshelf.Model.extend({
  tableName: 'users',
  requireFetch: false,
  hasTimestamps: true,
});

module.exports = {
  Users,
};
