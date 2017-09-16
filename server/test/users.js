process.env.NODE_ENV = 'test';

const User = require('../models/user');
const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../index');
const should = chai.should();

chai.use(chaiHttp);

var token = null;

describe('Users', function () {
  before(function (done) { //Before each test we call GET /admin/reset
    server.on('ready', function () {
      chai.request(server)
        .get('/admin/reset')
        .end(function (err, res) {
          if (err) throw err;
          chai.request(server)
            .post('/auth/signin')
            .set('Content-Type', 'application/json')
            .send({
              password: 'Qwerty123!',
              email: 'pinebit@gmail.com'
            })
            .end(function (err, res) {
              if (err) throw err;
              token = res.body.token;
              done();
            });
        });
    });
  });

  after(function () {
    server.close();
  });

  function getUsers(end) {
    chai.request(server)
      .get('/users')
      .set('x-access-token', token)
      .end(end);
  }

  describe('/GET users', function () {
    it('it should GET all users', function (done) {

      getUsers(function (err, res) {
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

      getUsers(function (err, res) {
        if (err) throw err;
        res.should.have.status(200);
        const userid = res.body[0]._id;

        chai.request(server)
          .put('/users/' + userid)
          .send({ name: 'master' })
          .set('x-access-token', token)
          .end(function (err, res) {
            if (err) throw err;
            res.should.have.status(200);

            getUsers(function (err, res) {
              if (err) throw err;
              res.body[0].name.should.be.eql('master');
              done();
            });
          });
      });
    });
  });
});
