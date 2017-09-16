/**
 * Module Dependencies
 */
const config = require('./config');
const restify = require('restify');
const mongoose = require('mongoose');
const restifyPlugins = require('restify-plugins');
const authenticate = require('./middleware/authenticate');

/**
  * Initialize Server
  */
const server = restify.createServer({
  name: config.name,
  version: config.version
});

/**
  * Middleware
  */
server.use(restifyPlugins.jsonBodyParser({ mapParams: true }));
server.use(restifyPlugins.acceptParser(server.acceptable));
server.use(restifyPlugins.queryParser({ mapParams: true }));
server.use(restifyPlugins.fullResponse());

/**
  * Start Server, Connect to DB & Require Routes
  */
server.listen(config.port, function () {
  // establish connection to mongodb
  mongoose.Promise = global.Promise;
  mongoose.connect(config.db.uri, { useMongoClient: true });

  const db = mongoose.connection;

  db.on('error', function (err) {
    console.error(err);
    process.exit(1);
  });

  db.once('open', function () {
    require('./routes/admin.js')(server);
    require('./routes/auth.js')(server);
    server.use(authenticate);
    require('./routes/users.js')(server);
    require('./routes/repairs.js')(server);

    console.log('Server is listening on port', config.port);

    server.emit('ready');
  });
});

module.exports = server; // for testing
