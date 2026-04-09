import pool from '../config/db.js';

// The exact URL you provided for the active lotteries
const LOTTERY_API_URL = 'https://data.gov.il/api/3/action/datastore_search?resource_id=7c8255d0-49ef-49db-8904-4cf917586031&limit=50'; // Starting with a limit of 50 for testing

// --- Helper Functions for Data Sanitization ---

// Best Practice: Modular function to clean the price string (e.g., "9,242.00" -> 9242.00)
const cleanPrice = (priceStr) => {
    if (!priceStr) return null;
    return parseFloat(priceStr.replace(/,/g, ''));
};

// Best Practice: Government APIs often return empty strings ("") for missing dates.
// PostgreSQL will crash if we try to insert "" into a TIMESTAMP column.
// This function converts empty strings to standard SQL nulls.
const cleanDate = (dateStr) => {
    if (!dateStr || dateStr.trim() === '') return null;
    // PostgreSQL natively understands "YYYY-MM-DD HH:MM:SS", so we can return it as is.
    return dateStr.trim(); 
};

export const syncLotteriesData = async () => {
    try {
        console.log('Fetching data from Gov API...');
        
        // Native fetch API (available in modern Node.js)
        const response = await fetch(LOTTERY_API_URL);
        const data = await response.json();

        // Extract the records array from the complex JSON structure
        const records = data.result.records;
        
        console.log(`Fetched ${records.length} records. Starting database sync...`);

        // Iterate through each record and insert/update it in the database
        for (const record of records) {
            
            // 1. Sanitize the data using our helper functions
            const pricePerMeter = cleanPrice(record.PriceForMeter);
            const signupEndDate = cleanDate(record.LotteryEndSignupDate);
            const lotteryDate = cleanDate(record.LotteryExecutionDate);
            const lotteryType = record.LotteryType ? record.LotteryType.trim() : 'לא צוין';

            // 2. Prepare the Upsert Query
            // Best Practice: ON CONFLICT DO UPDATE ensures we keep our data fresh.
            // We added the new date columns here so if the government extends a deadline, our DB updates automatically!
            const query = `
                INSERT INTO lotteries (
                    lottery_id, city, project_name, provider_name, 
                    price_per_meter, total_units, total_subscribers, status,
                    signup_end_date, lottery_date, lottery_type
                ) 
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
                ON CONFLICT (lottery_id) 
                DO UPDATE SET 
                    total_subscribers = EXCLUDED.total_subscribers,
                    status = EXCLUDED.status,
                    signup_end_date = EXCLUDED.signup_end_date,
                    lottery_date = EXCLUDED.lottery_date;
            `;

            // 3. Map the API fields to our parameterized SQL query
            const values = [
                record.LotteryId,
                record.LamasName,
                record.ProjectName,
                record.ProviderName,
                pricePerMeter,
                record.LotteryHousingUnits,
                record.Subscribers,
                record.ProjectStatus,
                signupEndDate,  
                lotteryDate,   
                lotteryType     
            ];

            // Execute the query for this specific record
            await pool.query(query, values);
        }

        console.log('🎉 Database sync completed successfully!');

    } catch (error) {
        console.error('❌ Error syncing data:', error);
    }
};

// If this file is run directly from the terminal, execute the function
if (process.argv[1].endsWith('syncService.js') || process.argv[1].endsWith('syncServer.js')) {
    syncLotteriesData().then(() => pool.end());
}