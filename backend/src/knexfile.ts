// knexfile.ts
import type { Knex } from 'knex';
import dotenv from 'dotenv';

dotenv.config();

const config: { [key: string]: Knex.Config } = {
  development: {
    client: 'pg',
    connection: {
      connectionString: process.env.DATABASE_URL + '?sslmode=require',
      //ssl: { rejectUnauthorized: false }
    },
    migrations: {
      directory: './migrations',
      extension: 'ts' // This is the key line
    },
    seeds: {
      directory: './seeds',
      extension: 'ts'
    }
  },
  
  production: {
    client: 'pg',
    connection: {
      connectionString: process.env.DB_CONNECTION_STRING,
      ssl: { rejectUnauthorized: false }
    },
    migrations: {
      directory: './migrations',
      extension: 'ts'
    }
  }
};

export default config;