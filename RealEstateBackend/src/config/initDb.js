import pool from './db.js';

// Best Practice: Wrap database operations in an async function to use await
const createTables = async () => {
    
    // --- RESET THE DATABASE (Development Best Practice) ---
    // We drop the tables before creating them to ensure our new columns are added.
    // We use CASCADE because 'direct_sales' has a foreign key depending on 'lotteries'.
    const dropTables = `
        DROP TABLE IF EXISTS direct_sales CASCADE;
        DROP TABLE IF EXISTS lotteries CASCADE;
    `;

    // --- CREATE LOTTERIES TABLE ---
    // Added: signup_end_date, lottery_date, lottery_type
    const createLotteriesTable = `
        CREATE TABLE lotteries (
            id SERIAL PRIMARY KEY,
            lottery_id INTEGER UNIQUE NOT NULL,
            city VARCHAR(255) NOT NULL,
            project_name VARCHAR(255),
            provider_name VARCHAR(255),
            price_per_meter DECIMAL(10, 2),
            total_units INTEGER,
            total_subscribers INTEGER,
            status VARCHAR(100),
            signup_end_date TIMESTAMP,
            lottery_date TIMESTAMP,
            lottery_type VARCHAR(100),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    `;

    // --- CREATE DIRECT SALES TABLE ---
    // Best Practice: 'ON DELETE CASCADE' means if a lottery is deleted, 
    // its associated direct sales are automatically deleted to prevent orphaned records.
    const createDirectSalesTable = `
        CREATE TABLE direct_sales (
            id SERIAL PRIMARY KEY,
            lottery_id INTEGER REFERENCES lotteries(lottery_id) ON DELETE CASCADE,
            available_units INTEGER,
            sale_start_date DATE,
            registration_link TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    `;

    try {
        console.log('⏳ Resetting and creating tables...');
        
        // 1. Drop existing tables to start fresh
        await pool.query(dropTables);
        console.log('🗑️  Old tables dropped (Development Reset).');

        // 2. Create the Lotteries table with the new columns
        await pool.query(createLotteriesTable);
        console.log('✅ Lotteries table created successfully.');
        
        // 3. Create the Direct Sales table
        await pool.query(createDirectSalesTable);
        console.log('✅ Direct Sales table created successfully.');
        
    } catch (error) {
        console.error('❌ Error creating tables:', error);
    } finally {
        // Best Practice: Always close the database pool when the standalone script finishes
        pool.end();
    }
};

// Execute the function
createTables();