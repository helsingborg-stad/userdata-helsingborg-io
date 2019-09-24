exports.up = knex => knex.schema.createTable('users', (t) => {
  t.increments('id').primary().unsigned();
  t.integer('person_nr').notNull().unique();
  t.string('first_name').notNull();
  t.string('last_name').notNull();
  t.string('email');
  t.string('device_id');
  t.string('telephone_nr');
  t.integer('post_nr').notNull();
  t.string('post_ort').notNull();
  t.string('adress').notNull();
  t.timestamps(true, true);
});

exports.down = knex => knex.schema.dropTableIfExists('users');
