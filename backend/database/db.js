import pg from 'pg'
export const pool = new pg.Pool({
    user: 'postgres',
  host: 'localhost',
  database: 'ai_sub',
  password: '0101',
  port: 5432,
})

