/* eslint-disable no-unused-expressions */
require('dotenv').config({ path: './.env.test' });
const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../../server');

const should = chai.should();
chai.use(chaiHttp);

describe('api/v1/user', () => {
  after(async () => {
    server.close();
  });

  describe('GET /api/v1/user/:pnr', () => {
    it('should return json on GET with correct query params at fake', async () => chai
      .request(server)
      .get('/api/v1/user/195809262743')
      .send()
      .then((res) => {
        res.should.have.status(200);
        res.should.be.json;
        should.exist(res.body);
      }));
  });

  describe('PUT /api/v1/user/:pnr', () => {
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
  });

  describe('POST /api/v1/user', () => {
    it('should add a new user', async () => {
      chai
        .request(server)
        .post('/api/v1/user')
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
    });
  });

  describe('GET /api/v1/user/:pnr', () => {
    it('should return the user', async () => {
      chai
        .request(server)
        .get('/api/v1/user/197607012395')
        .send()
        .then((res) => {
          res.should.have.status(200);
          res.should.be.json;
          should.exist(res.body);
          should.exist(res.body.data.attributes);
          should.exist(res.body.data.attributes.person_nr);
          chai.expect(res.body.data.attributes.person_nr).to.equal('197607012395');
        });
    });
  });

  describe('DELETE /api/v1/user/:pnr', () => {
    it('should correctly delete the user', async () => {
      chai
        .request(server)
        .delete('/api/v1/user/197607012395')
        .send()
        .then((res) => {
          res.should.have.status(200);
          res.should.be.json;
          should.exist(res.body);
        });
    });
  });
});
