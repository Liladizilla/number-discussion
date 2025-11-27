import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://user:password@localhost:5432/numberdiscussion',
});

export const initDB = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      username VARCHAR(255) UNIQUE NOT NULL,
      password_hash VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS calculations (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id),
      parent_id INTEGER REFERENCES calculations(id),
      operation VARCHAR(10),
      number DECIMAL NOT NULL,
      result DECIMAL NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE INDEX IF NOT EXISTS idx_parent ON calculations(parent_id);
  `);
};

export default pool;