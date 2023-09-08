import { ConfigService } from '@nestjs/config';
import configuration from './configuration';

export class DatabaseConfig {
  type: string;
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
  // entities: string[];
  // subscribers: string[];
  logging: boolean;
  synchronize: boolean;
  autoLoadEntities?: boolean;
  extra?: any;
  timezone: string;
}

const databaseConfig: DatabaseConfig = {
  autoLoadEntities: true,
  type: configuration().database.type,
  host: configuration().database.host,
  port: configuration().database.port,
  database: configuration().database.name,
  username: configuration().database.username,
  password: configuration().database.pass,
  // entities: [__dirname + '/../../**/**/*.entity{.ts,.js}'],
  // Timezone configured on the MySQL server.
  // This is used to typecast server date/time values to JavaScript Date object and vice versa.
  // Zulu timezone = UTC time
  timezone: 'Z',
  synchronize: false,
  logging: true,
  // subscribers: [__dirname + '/../../**/**/*.subscriber{.ts,.js}'],
  // debug: configService.get<string>('env') === 'development',
  extra: {
    connectionLimit: 50,
  },
};

export const getDatabaseConfig = (
  configService: ConfigService,
): DatabaseConfig => {
  return {
    autoLoadEntities: true,
    type: configService.get('database.type'),
    host: configService.get('database.host'),
    port: configService.get<number | undefined>('database.port'),
    username: configService.get('database.username'),
    password: configService.get('database.pass'),
    database: configService.get('database.name'),
    logging: configService.get('database.logging') == 'true',
    synchronize: false,
    // subscribers: [__dirname + '/../../**/**/*.subscriber{.ts,.js}'],
    // entities: [__dirname + '/../../**/**/*.entity{.ts,.js}'],
    timezone: 'Z',

    extra: {
      connectionLimit: configService.get('databaseLog'),
    },
  };
};

export default databaseConfig;
