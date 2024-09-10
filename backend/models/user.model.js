import { pool } from '../database/db.js'

import bcrypt from 'bcryptjs'

export const createUser = async(username, password , email,)=>{
    try{
        const existingUser = await pool.query(
            'SELECT id FROM users WHERE username = $1',
            [username]
          );
      
          if (existingUser.rows.length > 0) {
            // Username already exists
            throw new Error('Username already exists');
          }
    
        const hashedPassword = await bcrypt.hash(password,10);
    
        
        const result = await pool.query(
        'INSERT INTO users (username, password , email ) VALUES ($1, $2, $3) RETURNING id', [username,  hashedPassword , email]);
    
        console.log(" user created :- ", result.rows[0].id)
        return result.rows[0].id;
    }catch(error){
        throw error;
    }
}

export const getUser = async(username)=>{
    const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
    return result;
}