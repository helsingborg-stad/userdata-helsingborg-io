
const { genericSchema } = require('./person.schema');
const { client } = require('../../db/db.client');

const Persons = () => client('persons');

const reset = () => Persons()
  .truncate();

const query = async where => Persons()
  .select()
  .where(where)
  .orderBy('created_at', 'desc');

const create = entity => Persons()
  .insert(entity);

const getPersonById = async (personNr, callback) => query('select * from persons where person_nr=?', [personNr], callback);

const addPerson = async (Person, callback) => query('Insert into persons values(?,?,?,?,?)',
  [Person.personNr, Person.firsName, Person.lastName, Person.updatedAt, Person.createdAt],
  callback);

const deletePerson = async (personNr, callback) => query('delete from persons where personNr=?', [personNr], callback);

const updatePerson = async (personNr, Person, callback) => query('update task set personNr=?,firstName=?,lastName=?,updatedAt=?,createtAt=? where personNr=?',
  [personNr, Person.firsName, Person.lastName, Person.updatedAt, Person.createdAt],
  callback);

module.exports = {
  getPersonById,
  addPerson,
  deletePerson,
  updatePerson,
};
