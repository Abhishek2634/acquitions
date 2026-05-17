import 'dotenv/config';

import {neon, neonConfig} from '@neondatabase/serverless';
import {drizzle} from 'drizzle-orm/neon-http';

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  throw new Error('DATABASE_URL is required');
}

const parsedDatabaseUrl = new URL(DATABASE_URL);
const isNeonLocalHost = ['neon-local', 'localhost', '127.0.0.1'].includes(parsedDatabaseUrl.hostname);
const useNeonLocal = process.env.NEON_LOCAL === 'true' || isNeonLocalHost;

if (useNeonLocal) {
  const port = parsedDatabaseUrl.port || '5432';
  neonConfig.fetchEndpoint = `http://${parsedDatabaseUrl.hostname}:${port}/sql`;
  neonConfig.useSecureWebSocket = false;
  neonConfig.poolQueryViaFetch = true;
}

const sql = neon(DATABASE_URL);

const db = drizzle(sql);

export {db, sql};
