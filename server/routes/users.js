const User = require('../models/User');

module.exports = function (server) {
  server.get('/users', function (req, res) {
    const sendUsers = function (err, users) {
      if (err) throw err;
      res.send(users);
    };

    if (req._user.role === 'user') {
      sendUsers(null, [req._user]);
    } else {
      User.find({}, sendUsers);
    }
  });

  server.put('/users/:user_id', function (req, res) {
    if (req._user.role === 'user' && req._user._id !== req.params.user_id) {
      res.send(405);
    } else {
      User.findById(req.params.user_id, function (err, user) {
        if (err) throw err;
        if (!user) {
          res.send(404);
        } else {
          // so far we are supporting only name and role changes
          user.name = req.body.name || user.name;
          user.role = req.body.role || user.role;
          user.save(function (err) {
            if (err) throw err;
            res.send(200);
          })
        }
      })
    }
  });
};
