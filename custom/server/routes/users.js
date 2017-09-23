const errors = require('restify-errors');
const User = require('../models/User');

module.exports = function (server) {
  server.get('/users', function (req, res, next) {
    const sendUsers = function (err, users) {
      if (err) {
        return next(new errors.InternalError(err));
      }

      const cleared = users.map(function (user) {
        return {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          disabled: user.disabled,
        };
      });

      res.send(cleared);
      return next();
    };

    if (req._user.role === 'user') {
      sendUsers(null, [req._user]);
    } else {
      User.find({}, sendUsers);
    }
  });

  server.post('/users/:user_id', function (req, res, next) {
    if (req._user.role === 'user' && req._user._id !== req.params.user_id) {
      return next(new errors.MethodNotAllowedError("Users cannot modify other users data."));
    } else {
      User.findById(req.params.user_id, function (err, user) {
        if (err || !user) {
          return next(new errors.NotFoundError());
        }

        user.name = req.body.name || user.name;
        user.role = req.body.role || user.role;
        user.email = req.body.email || user.email;
        user.password = req.body.password || user.password;
        user.disabled = req.body.disabled === undefined ? user.disabled : req.body.disabled;

        user.save(function (err) {
          if (err) {
            return next(new errors.InternalError(err));
          }

          res.send(200);
          return next();
        })
      })
    }
  });

  server.del('/users/:user_id', function (req, res, next) {
    if (req._user.role === 'user') {
      return next(new errors.MethodNotAllowedError("Users cannot delete other users."));
    } else {
      User.remove({ _id: req.params.user_id }, function (err) {
        if (err) {
          return next(new errors.NotFoundError());
        }

        res.send(200);
        return next();
      })
    }
  });
};
