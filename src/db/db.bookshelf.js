const { bookshelf } = require('./db.client');

bookshelf.plugin('registry');

const Users = bookshelf.Model.extend({
  tableName: 'users',
  hasTimestamps: true,
});

module.exports = {
  users: bookshelf.model('Users', Users),
};
