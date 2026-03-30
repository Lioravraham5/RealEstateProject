import { Pool } from 'pg';
import 'dotenv/config'; // Modern and concise way to load .env variables

// Determine if the application is running in a production environment
const isProduction = process.env.NODE_ENV === 'production';

// Best Practice: Using a Connection Pool instead of a single Client.
// A pool manages multiple connections, allowing concurrent requests to be handled efficiently.
// Initialize the connection pool
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    
    // Disable SSL for local development to prevent connection errors,
    // but require it when deployed to a production cloud server.
    ssl: isProduction ? { rejectUnauthorized: false } : false
});

// Test the connection
pool.connect((err, client, release) => {
    if (err) {
        console.error('Error acquiring client from pool:', err.stack);
    } else {
        console.log('Successfully connected to the local PostgreSQL database! 🚀');
        release();
    }
});

// Export the pool using ES Modules syntax
export default pool;