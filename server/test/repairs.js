process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../index');
const should = chai.should();
const config = require('../config');

chai.use(chaiHttp);

let token = null;

function signin() {
  return chai.request(server)
    .post('/auth/signin')
    .set('Content-Type', 'application/json')
    .send({
      password: 'Qwerty123!',
      email: 'pinebit@gmail.com'
    });
}

describe('Repairs', function () {
  before(function (done) { //Before each test we call GET /admin/reset
    chai.request(server)
      .get('/admin/reset?secret=' + config.jwt.secret)
      .end(function (err, res) {
        if (err) {
          done(err);
        }

        signin().end(function (err, res) {
          if (err) {
            done(err);
          }

          token = res.body.token;

          chai.request(server)
            .post('/repairs')
            .set('Content-Type', 'application/json')
            .set('x-access-token', token)
            .send({
              date: '18.09.2017 10:00',
              description: 'Change tires',
              user: 'Jack',
              comments: [],
            })
            .end(done);
        });
      });
  });

  describe('/GET repairs', function () {
    it('it should get all repairs', function (done) {

      chai.request(server)
        .get('/repairs')
        .set('x-access-token', token)
        .end(function (err, res) {
          if (err) {
            done(err);
          }

          res.should.have.status(200);
          res.body.should.be.a('array');
          res.body.length.should.be.eql(1);
          res.body[0].description.should.be.eql('Change tires');
          done();
        });
      });
    });
});
