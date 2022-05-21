import { ConnectionOptions } from 'typeorm';

const connectionOptions: ConnectionOptions = {
  type: 'postgres',
  host: 'qq-db.cmvzttjzad3i.us-east-1.rds.amazonaws.com',
  port: 5432,
  username: 'root',
  password: 'SHO3Q5fRfuzCKFN5AUO1',
  database: 'QQ_DB',
  synchronize: true,
  logging: false,
  entities: ['src/entities/**/*.ts'],
  migrations: ['src/migration/**/*.ts'],
  subscribers: ['src/subscriber/**/*.ts'],
  cli: {
    entitiesDir: 'src/entities',
    migrationsDir: 'src/migrations',
    subscribersDir: 'src/subscriber',
  },
};

export = connectionOptions;
