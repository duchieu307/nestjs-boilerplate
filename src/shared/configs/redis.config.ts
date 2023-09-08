import { RedisModuleOptions } from '@liaoliaots/nestjs-redis';
import configuration from 'src/shared/configs/configuration';

export const getRedisConfig = (): RedisModuleOptions => {
  return {
    config: {
      url: `redis://${configuration().redis.host}:${
        configuration().redis.port
      }/0`,
    },
  };
};
