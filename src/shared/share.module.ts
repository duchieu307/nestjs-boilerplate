import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from 'src/database/database.module';
import configuration from './configs/configuration';
import { RedisModule } from '@liaoliaots/nestjs-redis';
import { getRedisConfig } from 'src/shared/configs/redis.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      load: [configuration],
      isGlobal: true,
    }),
    DatabaseModule,
    RedisModule.forRootAsync({
      imports: [],
      useFactory: getRedisConfig,
    }),
  ],
  exports: [ConfigModule, DatabaseModule],
})
export class SharedModule {}
