import pg from 'pg';
import dotenv from 'dotenv'
dotenv.config();
export const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
});

// import pg from 'pg';

// export const pool = new pg.Pool({
//   user: process.env.DB_USER || 'postgres',
//   host: process.env.DB_HOST || 'localhost',
//   database: process.env.DB_NAME || 'ai_sub',
//   password: process.env.DB_PASSWORD || '0101',
//   port: process.env.DB_PORT || 5432,
// });
