const User = require('../models/User');
const Repair = require('../models/Repair');

module.exports = function (server) {
  server.get('/admin/reset', function(req, res) {
    User.remove({}, function() {
      console.log('User collection removed');

      Repair.remove({}, function() {
        console.log('Repair collection removed');

        const admin = new User({
          name: 'pinebit',
          password: 'Qwerty123!',
          email: 'pinebit@gmail.com',
          role: 'admin'
        });

        admin.save(function (err) {
          if (err) {
            console.log('Failed to create admin user.', err);
            res.send(500);
          } else {
            console.log('Admin user created.');
            res.send(200);
          }
        });
      });
    });
  });
};
