const jwt = require('jsonwebtoken');
const User = require('../models/User');
const config = require('../config');

module.exports = function (server) {
  server.post('/auth/signin', function(req, res) {

    // find the user
    User.findOne({
      email: req.body.email
    }, function(err, user) {

      if (err) throw err;

      if (!user) {
        console.error('Authentication failed. User not found.');
        res.send(403);
      } else if (user) {

        // check if password matches
        user.comparePassword(req.body.password, function(err, isMatch) {
          if (err) throw err;
          if (!isMatch) {
            console.log('Authentication failed. Wrong password.');
            res.send(403);
          } else {
            const token = jwt.sign(user.email, config.jwt.secret);
            res.json({ token: token });
          }
        });
      }
    });
  });

  server.post('/auth/signup', function(req, res) {

    const user = new User({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password
    });

    user.save(function (err) {
      if (err) {
        console.log('Failed to create user.', err);
        res.send(500);
      } else {
        console.log('User has been created.');
        const token = jwt.sign(user.email, config.jwt.secret);
        res.json({ token: token });
      }
    });
  });
};
