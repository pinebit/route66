const errors = require('restify-errors');
const jwt = require('jsonwebtoken');
const config = require('../config');
const User = require('../models/User');

module.exports = function(req, res, next) {
  const token = (req.body && req.body.token) ||
                (req.query && req.query.token) ||
                req.headers['x-access-token'];
  if (token) {
    // verifies secret and checks exp
    jwt.verify(token, config.jwt.secret, function (err, decoded) {
      if (err) {
        return next(new errors.ForbiddenError("Provided token is invalid."));
      } else {
        User.findOne({ email: decoded }, function (err, user) {
          if (err) {
            return next(new errors.InternalError("No user is found for the given token."));
          }

          req._user = user;
          next();
        });
      }
    });
  } else {
    return next(new errors.ForbiddenError("No token is provided."));
  }
};
