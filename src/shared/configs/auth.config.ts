import configuration from 'src/shared/configs/configuration';

export const jwtConstants = {
  accessTokenSecret: configuration().jwtAccessTokenSecret,
  accessTokenExpiry: parseInt(configuration().jwtAccessTokenExpiration),
  refreshTokenExpiry: parseInt(configuration().jwtRefreshTokenExpiration),
};

export const AUTH_CACHE_PREFIX = 'AUTH_CACHE_PREFIX_';
