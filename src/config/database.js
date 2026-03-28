// src/config/database.js
import pg from 'pg';
const { Pool } = pg;

// Create a connection pool using the DATABASE_URL from .env
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    // Optional: Add SSL configuration for Render (required for external connections)
    ssl: {
        rejectUnauthorized: false
    }
});

// Test connection on startup
pool.connect((err, client, release) => {
    if (err) {
        console.error('Error acquiring database client:', err.stack);
    } else {
        console.log('Database connected successfully');
        release();
    }
});

export { pool };