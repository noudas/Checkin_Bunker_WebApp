require('dotenv').config();
const { createClient } = require('redis');

const redis = createClient({
  url: `redis://default:${process.env.REDIS_PASSWORD}@${process.env.PUBLIC_ENDPOINT}`,
});

redis.on('error', (err) => console.error('Redis Client Error:', err));

(async () => {
  await redis.connect();
})();

module.exports = redis;
