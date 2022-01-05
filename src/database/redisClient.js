const RedisDatabase = require('./redisDB');

var dbRedis;

module.exports = function GetRedisClient() {
  if (!dbRedis) {
    dbRedis = new RedisDatabase();
  } 
  return dbRedis.client;
};

