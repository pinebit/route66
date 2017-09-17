process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../index');
const should = chai.should();

chai.use(chaiHttp);

var token = null;

function getUsers() {
  return chai.request(server)
    .get('/users')
    .set('x-access-token', token);
}

function signin() {
  return chai.request(server)
    .post('/auth/signin')
    .set('Content-Type', 'application/json')
    .send({
      password: 'Qwerty123!',
      email: 'pinebit@gmail.com'
    });
}

describe('Users', function () {
  before(function (done) { //Before each test we call GET /admin/reset
    chai.request(server)
      .get('/admin/reset')
      .end(function (err, res) {
        if (err) {
          done(err);
        }

        signin().end(function (err, res) {
          if (err) {
            done(err);
          }

          token = res.body.token;
          done();
        });
      });
  });

  describe('/GET users', function () {
    it('it should GET all users', function (done) {

      getUsers().end(function (err, res) {
        if (err) {
          done(err);
        }

        res.should.have.status(200);
        res.body.should.be.a('array');
        res.body.length.should.be.eql(1);
        res.body[0].email.should.be.eql('pinebit@gmail.com');
        done();
      });
    });
  });

  describe('/PUT users/:id', function () {
    it('it should modify user', function (done) {

      getUsers().end(function (err, res) {
        if (err) {
          done(err);
        }

        res.should.have.status(200);
        const uid = res.body[0]._id;

        chai.request(server)
          .put('/users/' + uid)
          .send({ name: 'master' })
          .set('x-access-token', token)
          .end(function (err, res) {
            if (err) {
              done(err);
            }

            res.should.have.status(200);

            getUsers().end(function (err, res) {
              if (err) {
                done(err);
              }

              res.body[0].name.should.equal('master');
              done();
            });
          });
      });
    });
  });
});
