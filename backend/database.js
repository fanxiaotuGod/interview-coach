import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST, 
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: 5432
});

pool.connect()
  .then(() => console.log('Connected to PostgreSQL on Docker'))
  .catch(err => {
    console.error('Connection error:', err.message);
    console.error('Full error stack:', err.stack);
  });

export default pool;