const Repair = require('../models/Repair');

module.exports = function (server) {
  server.get('/repairs', function (req, res) {
    var query = {};
    if (req._user.role === 'user') {
      query = { user: req._user.email };
    }

    Repair.find(query, function (err, repairs) {
      if (err) throw err;
      res.send(repairs);
    });
  });

  server.post('/repairs', function (req, res) {
    if (req._user.role === 'user') {
      res.send(403);
    } else {
      const repair = new Repair(req.body);
      repair.save(function (err) {
        if (err) throw err;
        res.send(201);
      })
    }
  });

  server.put('/repairs/:repair_id', function (req, res) {
    Repair.findById(req.params.repair_id, function (err, repair) {
      if (err) throw err;

      if (!repair) {
        res.send(404);
      } else if (req._user.role === 'user' && repair.user !== req._user.email) {
        res.send(403);
      } else {
        repair.date = req.body.date || repair.date;
        repair.description = req.body.description || repair.description;
        repair.user = req.body.user || repair.user;
        repair.state = req.body.state || repair.state;
        repair.comments = req.body.comments || repair.comments;

        repair.save(function (err) {
          if (err) throw err;
          res.send(200);
        })
      }
    });
  });
};
