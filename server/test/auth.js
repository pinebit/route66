process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../index');
const should = chai.should();
const config = require('../config');

chai.use(chaiHttp);

var token = null;

function getUsers() {
  return chai.request(server)
    .get('/users')
    .set('x-access-token', token);
}

describe('Auth', function () {
  before(function (done) { //Before each test we call GET /admin/reset
    chai.request(server)
      .get('/admin/reset?secret=' + config.jwt.secret)
      .end(function (err) {
        if (err) {
          done(err);
        }

        done();
      });
  });

  describe('POST /auth/signup ', function () {
    it('it should create new user', function (done) {

      chai.request(server)
        .post('/auth/signup')
        .send({
          name: 'Jack',
          email: 'jack@mail.com',
          password: 'jack123!'
        })
        .end(function (err, res) {
          if (err) {
            done(err);
          }

          res.should.have.status(200);
          res.body.token.should.not.equal(null);
          token = res.body.token;

          getUsers().end(function (err, res) {
            if (err) {
              done(err);
            }

            // having user role I get only my record
            res.body.length.should.equal(1);
            res.body[0].name.should.equal('Jack');
            done();
          });
        });
    });
  });
});

