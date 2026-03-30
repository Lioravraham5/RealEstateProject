import pool from './db.js';

// Best Practice: Wrap database operations in an async function to use await
const createTables = async () => {
    // Note: 'IF NOT EXISTS' prevents errors if we run this script multiple times.
    // We use DECIMAL(10,2) for prices to maintain precise financial data.
    // We make 'lottery_id' UNIQUE so we can reference it easily from the other table.
    const createLotteriesTable = `
        CREATE TABLE IF NOT EXISTS lotteries (
            id SERIAL PRIMARY KEY,
            lottery_id INTEGER UNIQUE NOT NULL,
            city VARCHAR(255) NOT NULL,
            project_name VARCHAR(255),
            provider_name VARCHAR(255),
            price_per_meter DECIMAL(10, 2),
            total_units INTEGER,
            total_subscribers INTEGER,
            status VARCHAR(100),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    `;

    // The 'direct_sales' table holds the standalone apartments.
    // Best Practice: 'ON DELETE CASCADE' means if a lottery is deleted, 
    // its associated direct sales are automatically deleted to prevent orphaned records.
    const createDirectSalesTable = `
        CREATE TABLE IF NOT EXISTS direct_sales (
            id SERIAL PRIMARY KEY,
            lottery_id INTEGER REFERENCES lotteries(lottery_id) ON DELETE CASCADE,
            available_units INTEGER,
            sale_start_date DATE,
            registration_link TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    `;

    try {
        console.log('⏳ Creating tables...');
        
        // Execute the SQL queries sequentially
        await pool.query(createLotteriesTable);
        console.log('✅ Lotteries table created successfully.');
        
        await pool.query(createDirectSalesTable);
        console.log('✅ Direct Sales table created successfully.');
        
    } catch (error) {
        console.error('❌ Error creating tables:', error);
    } finally {
        // Best Practice: Always close the database pool when the standalone script finishes
        // Otherwise, the terminal command will hang indefinitely.
        pool.end();
    }
};

// Execute the function
createTables();