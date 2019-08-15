import { createConnection } from 'typeorm';
import { join } from 'path';

export function initDb() {
  createConnection({
    type: 'mysql',
    host: 'localhost',
    port: 3306,
    database: 'edmit-meal',
    username: 'root',
    synchronize: true,
    entities: [join(__dirname, '../models/**.ts')],
    logging: true,
    supportBigNumbers: true,
    bigNumberStrings: false
  });
}
