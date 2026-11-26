import { readFile } from 'node:fs/promises';
import pg from 'pg';

import { config } from '../config.js';

export const pool = new pg.Pool({ connectionString: config.databaseUrl });
pool.on('error', (error) => console.error('Idle database connection closed:', error.message));

export async function migrate() {
  const schema = await readFile(new URL('./schema.sql', import.meta.url), 'utf8');
  await pool.query(schema);
}
