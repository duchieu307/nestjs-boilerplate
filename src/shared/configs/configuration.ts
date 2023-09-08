export default () => ({
  port: process.env.APP_PORT,
  name: process.env.APP_NAME,
  version: process.env.APP_VERSION,
  log: process.env.APP_LOG,

  apiKey: process.env.API_KEY,

  jwtAccessTokenSecret: process.env.JWT_ACCESS_TOKEN_SECRET,
  jwtAccessTokenExpiration: process.env.JWT_ACCESS_TOKEN_EXPIRATION_TIME,
  jwtRefreshTokenExpiration: process.env.JWT_REFRESH_TOKEN_EXPIRATION_TIME,

  database: {
    type: process.env.DB_TYPE,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : undefined,
    name: process.env.APP_NAME,
    username: process.env.DB_USER,
    pass: process.env.DB_PASSWORD,
    logging: process.env.DB_LOGGING,
    limit: process.env.DB_CONNECTION_LIMIT,
  },
  redis: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT ? parseInt(process.env.REDIS_PORT, 10) : 6379,
    // ttl: process.env.REDIS_TTL,
  },
});
