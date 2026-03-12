import pkg from 'pg';
const { Pool } = pkg;

/**
 * Connection pool for PostgreSQL database.
 */
const pool = new Pool({
    connectionString: process.env.DB_URL,
    ssl: true
});

/**
 * Common SSL Issue:
 *
 * You may encounter SSL connection errors depending on your operating system, Node.js
 * version, or PostgreSQL server settings. If you have confirmed your credentials are
 * correct but still see SSL errors, try updating the 'ssl' property in the Pool
 * configuration above to:
 *
 * ssl: {
 *     rejectUnauthorized: false
 * }
 */

let db = null;

if (process.env.NODE_ENV === 'development' && process.env.ENABLE_SQL_LOGGING === 'true') {
    db = {
        async query(text, params) {
            try {
                const start = Date.now();
                const res = await pool.query(text, params);
                const duration = Date.now() - start;
                console.log('Executed query:', { 
                    text: text.replace(/\s+/g, ' ').trim(), 
                    duration: `${duration}ms`, 
                    rows: res.rowCount 
                });
                return res;
            } catch (error) {
                console.error('Error in query:', { 
                    text: text.replace(/\s+/g, ' ').trim(), 
                    error: error.message 
                });
                throw error;
            }
        },

        async close() {
            await pool.end();
        }
    };
} else {
    db = pool;
}

const testConnection = async() => {
    try {
        const result = await db.query('SELECT NOW() as current_time');
        console.log('Database connection successful:', result.rows[0].current_time);
        return true;
    } catch (error) {
        console.error('Database connection failed:', error.message);
        throw error;
    }
};

export { db as default, testConnection };