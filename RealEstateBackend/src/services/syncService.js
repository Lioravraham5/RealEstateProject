import pool from '../config/db.js';

// The exact URL you provided for the active lotteries
const LOTTERY_API_URL = 'https://data.gov.il/api/3/action/datastore_search?resource_id=7c8255d0-49ef-49db-8904-4cf917586031&limit=50'; // Starting with a limit of 50 for testing

// Best Practice: Modular function to clean the price string (e.g., "9,242.00" -> 9242.00)
const cleanPrice = (priceStr) => {
    if (!priceStr) return null;
    return parseFloat(priceStr.replace(/,/g, ''));
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
            const pricePerMeter = cleanPrice(record.PriceForMeter);

            // Best Practice: Upsert (Update or Insert) using ON CONFLICT.
            // This ensures our database doesn't crash if we run the sync script multiple times.
            const query = `
                INSERT INTO lotteries (
                    lottery_id, city, project_name, provider_name, 
                    price_per_meter, total_units, total_subscribers, status
                ) 
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
                ON CONFLICT (lottery_id) 
                DO UPDATE SET 
                    total_subscribers = EXCLUDED.total_subscribers,
                    status = EXCLUDED.status;
            `;

            // Map the API fields to our parameterized SQL query ($1, $2, etc.) to prevent SQL Injection
            const values = [
                record.LotteryId,
                record.LamasName,
                record.ProjectName,
                record.ProviderName,
                pricePerMeter,
                record.LotteryHousingUnits,
                record.Subscribers,
                record.ProjectStatus
            ];

            await pool.query(query, values);
        }

        console.log('🎉 Database sync completed successfully!');

    } catch (error) {
        console.error('❌ Error syncing data:', error);
    }
};

// If this file is run directly from the terminal, execute the function
if (process.argv[1].endsWith('syncService.js')) {
    syncLotteriesData().then(() => pool.end());
}