import { DataSource, DataSourceOptions } from 'typeorm';

export let dbOptions: DataSourceOptions;

switch (process.env.NODE_ENV) {
  case 'development':
    dbOptions = {
      type: 'sqlite',
      database: 'db.sqlite',
      entities: ['**/*.entity.js'],
      synchronize: false,
      migrations: ['migrations/*.js'],
    };
    break;
  case 'test':
    dbOptions = {
      type: 'sqlite',
      database: 'test.sqlite',
      entities: ['**/*.entity.ts'],
      synchronize: false,
      migrations: ['migrations/*.js'],
      migrationsRun: true,
    };
    break;
  case 'production':
    break;

  default:
    throw new Error('Invalid NODE_ENV');
}

const dataSource = new DataSource(dbOptions);

export default dataSource;
