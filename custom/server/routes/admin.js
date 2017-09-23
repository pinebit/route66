const errors = require('restify-errors');
const User = require('../models/User');
const Repair = require('../models/Repair');
const config = require('../config');

module.exports = function (server) {
  server.get('/admin/reset', function(req, res, next) {
    if (req.query.secret !== config.jwt.secret) {
      return next(new errors.BadRequestError("Valid secret must be provided."));
    }

    User.remove({}, function() {
      Repair.remove({}, function() {
        const admin = new User({
          name: 'pinebit',
          password: 'Qwerty123!',
          email: 'pinebit@gmail.com',
          role: 'admin'
        });

        admin.save(function (err) {
          if (err) {
            return next(new errors.InternalServerError(err));
          }

          res.send(200);
          return next();
        });
      });
    });
  });
};
