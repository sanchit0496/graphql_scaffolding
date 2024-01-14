// config/redisClient.js
const Redis = require('ioredis');
const redisClient = new Redis(); // default to localhost and 6379
module.exports = redisClient;
