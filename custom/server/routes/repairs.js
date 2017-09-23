const errors = require('restify-errors');
const Repair = require('../models/Repair');

module.exports = function (server) {
  server.get('/repairs', function (req, res, next) {
    let query = {};
    if (req._user.role === 'user') {
      query = { user: req._user._id };
    }

    Repair.find(query, function (err, repairs) {
      if (err) {
        return next(new errors.InternalError(err));
      }

      res.send(repairs);
      return next();
    });
  });

  server.post('/repairs', function (req, res, next) {
    if (req._user.role === 'user') {
      return next(new errors.MethodNotAllowedError("Users cannot create repairs."));
    } else {
      const repair = new Repair(req.body);
      repair.save(function (err) {
        if (err) {
          return next(new errors.InternalError(err));
        }
        res.send(201);
        return next();
      })
    }
  });

  server.post('/repairs/:repair_id', function (req, res, next) {
    Repair.findById(req.params.repair_id, function (err, repair) {
      if (err) {
        return next(new errors.InternalError(err));
      }

      if (!repair) {
        return next(new errors.NotFoundError("Requested repair is not found."));
      } else if (req._user.role === 'user' && repair.user !== req._user._id) {
        return next(new errors.MethodNotAllowedError("Users cannot modify other users repairs."));
      } else {
        repair.date = req.body.date || repair.date;
        repair.description = req.body.description || repair.description;
        repair.user = req.body.user || repair.user;
        repair.state = req.body.state || repair.state;
        repair.comments = req.body.comments || repair.comments;

        repair.save(function (err) {
          if (err) {
            return next(new errors.InternalError(err));
          }

          res.send(200);
          return next();
        })
      }
    });
  });

  server.del('/repairs/:repair_id', function (req, res, next) {
    Repair.remove({ _id: req.params.repair_id }, function (err) {
      if (err) {
        return next(new errors.InternalError(err));
      }

      res.send(200);
      return next();
    });
  });
};
