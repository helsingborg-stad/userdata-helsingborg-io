const up = async (knex) => {
  await knex.schema.createTable('users', (t) => {
    t.increments('id').unsigned().primary();
    t.string('person_nr').notNull();
    t.string('first_name').notNull();
    t.string('last_name').notNull();
    t.string('email').notNull();
    t.string('device_id').notNull();
    t.string('telefon_nr').notNull();
    t.string('post_nr').notNull();
    t.string('post_ort').notNull();
    t.string('adress').notNull();
    t.string('updated_at').notNull();
    t.dateTime('created_at').notNull().defaultsTo(knex.fn.now());

    // indices
    t.unique('person_id');
  });
};

const down = async (knex) => {
  await knex.schema.dropTableIfExists('users');
};

module.exports = {
  up,
  down,
};
