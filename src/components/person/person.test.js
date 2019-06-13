/* eslint-disable no-unused-expressions */
require('dotenv').config({ path: './.env.test' });
const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../../app');
const Persons = require('./person.db');
const { client } = require('../../db/db.client');

const should = chai.should();
chai.use(chaiHttp);

describe('Person', () => {
  after(async () => {
    server.close();
    await Persons.reset();
    await client.destroy();
  });

  beforeEach(async () => {
    await Persons.reset();
  });

  it('should return json on GET with faked query', async () => chai
    .request(server)
    .get('/person/fake')
    .send()
    .then((res) => {
      res.should.have.status(200);
      res.should.be.json;
      should.exist(res.body);
    }));

  it('should return json on GET with correct query params at fake', async () => chai
    .request(server)
    .get('/person/fake?person_id=john_snow')
    .send()
    .then((res) => {
      res.should.have.status(200);
      res.should.be.json;
      should.exist(res.body);
    }));

  it('should allow POST with valid body at fake', async () => chai
    .request(server)
    .post('/person/fake')
    .send({
      person_id: 'john_snow',
    })
    .then((res) => {
      res.should.have.status(200);
      res.should.be.json;
      should.exist(res.body);
    }));


  it('should return json on GET at fake', async () => chai
    .request(server)
    .get('/person/fake')
    .send()
    .then((res) => {
      res.should.have.status(200);
      res.should.be.json;
      should.exist(res.body);
    }));

  it('should return json on GET with correct query params', async () => chai
    .request(server)
    .get('/person?person_id=john_snow')
    .send()
    .then((res) => {
      res.should.have.status(200);
      res.should.be.json;
      should.exist(res.body);
    }));

  it('should allow POST with valid body on real query', async () => chai
    .request(server)
    .post('/person')
    .send({
      person_id: 'john_snow',
    })
    .then((res) => {
      res.should.have.status(200);
      should.exist(res.body);
    }));

  it('should correctly add entity to db on POST and return the new entity on GET', async () => {
    const requester = chai.request(server).keepOpen();

    await requester
      .post('/person')
      .send({
        person_id: 'john_snow',
      });

    await requester
      .get('/person?person_id=john_snow')
      .send()
      .then((res) => {
        res.should.have.status(200);
        res.should.be.json;
        should.exist(res.body);
        res.body[0].should.have.property('person_id');
        res.body[0].person_id.should.equal('john_snow');
      });

    requester.close();
  });
});
