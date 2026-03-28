import { Pool } from 'pg';

/**
 * Connection pool for PostgreSQL database.
 */
const rawPool = new Pool({
    connectionString: process.env.DATABASE_URL, // ✅ fixed variable name
    ssl: { rejectUnauthorized: false }          // Render requires SSL (allow self-signed cert)
});

let pool = null;

if (process.env.NODE_ENV === 'development' && process.env.ENABLE_SQL_LOGGING === 'true') {
    pool = {
        async query(text, params) {
            try {
                const start = Date.now();
                const res = await rawPool.query(text, params);
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
            await rawPool.end();
        }
    };
} else {
    pool = rawPool;
}

const testConnection = async() => {
    try {
        const result = await pool.query('SELECT NOW() as current_time');
        console.log('Database connection successful:', result.rows[0].current_time);
        return true;
    } catch (error) {
        console.error('Database connection failed:', error.message);
        throw error;
    }
};

export { pool, testConnection };