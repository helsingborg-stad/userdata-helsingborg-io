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
      device_id: 'KILLERNAME123',
      telephone_nr: '0704838154',
      email: 'ylva.johansson@gmail.com',
    })
    .then((res) => {
      res.should.have.status(200);
      res.should.be.json;
      should.exist(res.body);
    }));

  it('should correctly add entity to db on PUT and return the new entity on GET', async () => {
    const requester = chai.request(server).keepOpen();

    await requester
      .put('/api/v1/user')
      .send({
        person_nr: '197607012395',
        first_name: 'Fredrik',
        last_name: 'Nobel',
        email: null,
        device_id: null,
        telephone_nr: null,
        post_nr: '90737',
        post_ort: 'UMEÅ',
        adress: 'KLINTVÄGEN 19 LGH 1201',
      });

    await requester
      .get('/api/v1/user/197607012395')
      .send()
      .then((res) => {
        res.should.have.status(200);
        res.should.be.json;
        should.exist(res.body);
        res.body[0].should.have.property('person_nr');
        res.body[0].person_id.should.equal('197607012395');
      });

    requester.close();
  });
});
