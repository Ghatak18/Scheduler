import knex from 'knex';
import dotenv from 'dotenv';

dotenv.config();


const db = knex({
  client: 'pg',
  connection: {
    //connectionString: "postgresql://admin:0diMYXiNpAcNLIuwuUXRl6FifTiafKoV@dpg-d2s22jbipnbc73e5819g-a.oregon-postgres.render.com/scheduler_62sv",
    connectionString: process.env.DATABASE_URL,
    // ssl: {
    //   rejectUnauthorized: false // Required for Render
    // }
    ssl: true
  }
});

// Connection test (optional)
db.raw('SELECT 1')
  .then(() => console.log('Database connected'))
  .catch(err => console.log('Database connection failed:', err));

export default db;