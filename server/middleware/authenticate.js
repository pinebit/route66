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
        console.error(err);
        return res.send(403);
      } else {
        User.findOne({ email: decoded }, function (err, user) {
          if (err) throw err;
          req._user = user;
          next();
        });
      }
    });
  } else {
    return res.send(403);
  }
};
