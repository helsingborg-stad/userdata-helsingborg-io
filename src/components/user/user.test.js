/* eslint-disable no-unused-expressions */
require('dotenv').config({ path: './.env.test' });
const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../../server');

const should = chai.should();
chai.use(chaiHttp);

describe('User', () => {
  after(async () => {
    server.close();
  });

  it('should return json on GET with correct query params at fake', async () => chai
    .request(server)
    .get('/api/v1/user/195809262743')
    .send()
    .then((res) => {
      res.should.have.status(200);
      res.should.be.json;
      should.exist(res.body);
    }));

  it('should allow PUT with valid body at fake', async () => chai
    .request(server)
    .put('/api/v1/user/195809262743')
    .send({
      person_nr: '195809262743',
      device_id: 'KILLERNAME123',
      telephone_nr: '0704838154',
      email: 'ylva.johansson@gmail.com',
    })
    .then((res) => {
      res.should.have.status(200);
      res.should.be.json;
      should.exist(res.body);
    }));
  
  it('should correctly update entity to db on PUT and return the updated entity on GET', async () => {
    const requester = chai.request(server).keepOpen();

    await requester
      .put('/api/v1/user/195809262743')
      .send({
        person_nr: '195809262743',
        first_name: 'Fredrik',
        last_name: 'Nobel',
        email: 'fredrik.nobel@nobelstiftelsen.se',
        device_id: 'TESTDEVICE01',
        telephone_nr: '070000000',
        post_nr: '90737',
        post_ort: 'UMEÅ',
        adress: 'KLINTVÄGEN 19 LGH 1201',
      }).then((res) => {
        res.should.have.status(200);
        res.should.be.json;
      });

    await requester
      .get('/api/v1/user/195809262743')
      .send()
      .then((res) => {
        res.should.have.status(200);
        res.should.be.json;
        should.exist(res.body);
        res.body.data.attributes.should.have.property('person_nr');
        res.body.data.attributes.person_nr.should.equal('195809262743');
      });

    requester.close();
  });

  it('should correctly create entity to db on unknown user GET and return the created entity on GET', async () => {
    const requester = chai.request(server).keepOpen();

    await requester
      .get('/api/v1/user/197607012395')
      .send()
      .then((res) => {
        res.should.have.status(200);
        res.should.be.json;
        should.exist(res.body);
      });

    await requester
      .get('/api/v1/user/197607012395')
      .send()
      .then((res) => {
        res.should.have.status(200);
        res.should.be.json;
        should.exist(res.body);
        res.body.data.attributes.should.have.property('person_nr');
        res.body.data.attributes.person_nr.should.equal('197607012395');
      });

    requester.close();
  });

});
