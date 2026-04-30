import pool from '../config/db.js';
import { upsertLottery } from '../repositories/lotteryRepository.js';

// The exact URL you provided for the active lotteries
const LOTTERY_API_URL = 'https://data.gov.il/api/3/action/datastore_search?resource_id=7c8255d0-49ef-49db-8904-4cf917586031&limit'; // Starting with a limit of 50 for testing

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
        console.log('Fetching ALL data from Gov API...');
        
        const response = await fetch(LOTTERY_API_URL);
        const data = await response.json();
        const records = data.result.records;
        
        console.log(`Fetched ${records.length} records. Starting database sync via Repository...`);

        for (const record of records) {
            const pricePerMeter = cleanPrice(record.PriceForMeter);
            const signupEndDate = cleanDate(record.LotteryEndSignupDate);
            const lotteryDate = cleanDate(record.LotteryExecutionDate);
            const lotteryType = record.LotteryType ? record.LotteryType.trim() : 'לא צוין';

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

            // Delegate the database operation to the Repository layer
            await upsertLottery(values);
        }

        console.log('🎉 Database sync completed successfully!');

    } catch (error) {
        console.error('❌ Error syncing data:', erroב
    }
};

// If this file is run directly from the terminal, execute the function
if (process.argv[1].endsWith('syncService.js') || process.argv[1].endsWith('syncServer.js')) {
    syncLotteriesData().then(() => pool.end());
}