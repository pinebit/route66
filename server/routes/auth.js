const errors = require('restify-errors');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const config = require('../config');

module.exports = function (server) {
  server.post('/auth/signin', function(req, res, next) {

    User.findOne({
      email: req.body.email
    }, function(err, user) {
      if (err || !user) {
        return next(new errors.NotFoundError(err || "User not found."));
      }

      user.comparePassword(req.body.password, function(err, isMatch) {
        if (err || !isMatch) {
          return next(new errors.ForbiddenError("Wrong password."));
        }

        const token = jwt.sign(user.email, config.jwt.secret);
        res.json({ token: token });
      });
    });
  });

  server.post('/auth/signup', function(req, res, next) {
    if (!req.body.name ||
        !req.body.email ||
        !req.body.password) {
      return next(new errors.ExpectationFailedError("Expected name, email and password."));
    }

    const user = new User({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password
    });

    user.save(function (err) {
      if (err) {
        return next(new errors.InternalError(err));
      } else {
        const token = jwt.sign(user.email, config.jwt.secret);
        res.json({ token: token });
      }
    });
  });
};
