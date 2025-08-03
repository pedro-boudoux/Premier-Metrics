// lib/db.js
import pg from 'pg';

export async function getDbConnection() {
  const client = new pg.Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  });
  
  await client.connect();
  return client;
}

export function createPool() {
  return new pg.Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
    max: 10, 
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
  });
}