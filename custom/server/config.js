module.exports = {
  name: 'ROUTE66',
  env: process.env.NODE_ENV || 'development',
  port: process.env.PORT || 3003,
  base_url: process.env.BASE_URL || 'http://localhost:3003',
  db: {
    uri: 'mongodb://route66:FKADJW0JT7mpx6ds@pinebit-shard-00-00-lzxpl.mongodb.net:27017,pinebit-shard-00-01-lzxpl.mongodb.net:27017,pinebit-shard-00-02-lzxpl.mongodb.net:27017/test?ssl=true&replicaSet=pinebit-shard-0&authSource=admin',
  },
  jwt: {
    secret: 'reactacademy'
  }
};
