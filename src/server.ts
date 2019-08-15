import { createServer } from 'http';
import express from 'express';

import { initDb } from './lib/db';
import { initGraphql } from './lib/graphql';
import { join } from 'path';

initDb();

const app = express();

initGraphql()
  .then(gql => app.use('/graphql', gql))
  .then(app => createServer(app).listen(8080))
  .catch(e => console.log(e));

app.use('/', express.static(join(__dirname, 'static')));
