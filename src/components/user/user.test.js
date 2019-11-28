/* eslint-disable no-unused-expressions */
require('dotenv').config({ path: './.env.test' });
const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../../app');

const should = chai.should();
chai.use(chaiHttp);

describe('api/v1/', () => {
  after(async () => {
    server.close();
  });

  describe('GET /user/:person_nr', () => {
    it('should return json on GET with correct user data', async () => {
      chai
        .request(server)
        .get('/api/v1/user/195809262743')
        .send()
        .then((res) => {
          res.should.have.status(200);
          res.should.be.json;
          should.exist(res.body);
        });
    });
  });

  describe('DELETE /user/:person_nr', () => {
    it('should erase all forms of a single user', async () => {
      chai
        .request(server)
        .delete('/api/v1/user/195003042222')
        .send()
        .then((res) => {
          res.should.have.status(200);
          res.should.be.json;
          should.exist(res.body);
        });
    });
  });

  describe('PUT /user/:person_nr', () => {
    it('should allow PUT with valid body to a specific user', async () => {
      chai
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
        });
    });
  });
});
