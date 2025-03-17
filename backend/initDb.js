import pool from './database.js';

const createUsersTable = async () => {
    const query = `
        CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            name VARCHAR(100),
            email VARCHAR(100) UNIQUE,
            password VARCHAR(100)
        );
    `;

    try {
        await pool.query(query);
        console.log('Users table created successfully');
    } catch (error) {
        console.error('Error creating users table:', error);
    }
};
const createInterviewTable = async () => {
    const query = `
      CREATE TABLE IF NOT EXISTS interviews (
        id SERIAL PRIMARY KEY,
        user_id INTEGER,
        resume_text TEXT,
        job_description TEXT,
        responses TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;
  
    try {
      await pool.query(query);
      console.log('Interview table created successfully.');
    } catch (error) {
      console.error('Error creating interview table:', error);
    }
};

createInterviewTable();
createUsersTable();
