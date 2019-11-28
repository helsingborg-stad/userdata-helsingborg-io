const { bookshelf } = require('./db.client');

const Users = bookshelf.Model.extend({
  tableName: 'users',
  requireFetch: false,
  hasTimestamps: true,
});

module.exports = {
  Users,
};
