const config = require('./config');
const restify = require('restify');
const mongoose = require('mongoose');
const restifyPlugins = require('restify-plugins');
const authenticate = require('./middleware/authenticate');
const morgan = require('morgan');
const corsMiddleware = require('restify-cors-middleware');

// Initialize Server
const server = restify.createServer({
  name: config.name,
  version: config.version
});

// Establish connection to mongodb
mongoose.Promise = global.Promise;
mongoose.connect(config.db.uri, { useMongoClient: true });

const db = mongoose.connection;
db.on('error', function (err) {
  console.error(err);
  process.exit(1);
});
db.once('open', function () {
  console.log('Database is ready');
});

// Middleware
server.use(morgan('tiny'));
server.use(restifyPlugins.jsonBodyParser({ mapParams: true }));
server.use(restifyPlugins.acceptParser(server.acceptable));
server.use(restifyPlugins.queryParser({ mapParams: true }));
server.use(restifyPlugins.fullResponse());
const cors = corsMiddleware({ origins: ['http://localhost:3000'] });
server.pre(cors.preflight);
server.use(cors.actual);

// Routes
require('./routes/admin.js')(server);
require('./routes/auth.js')(server);
server.use(authenticate);
require('./routes/users.js')(server);
require('./routes/repairs.js')(server);


server.listen(config.port, function () {
  console.log('Server is listening on port', config.port);
});

module.exports = server; // for testing
