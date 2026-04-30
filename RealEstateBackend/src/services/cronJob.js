import cron from 'node-cron';
import { syncLotteriesData } from './syncService.js';
import { syncCityCoordinates } from './geocodeService.js';

export const startCronJobs = () => {
    console.log('⏰ Initializing CRON Jobs Task Manager...');

    // Best Practice: Always specify the timezone for cron jobs to avoid unexpected behavior due to server timezone differences or daylight saving changes.
    const timezoneConfig = {
        scheduled: true,
        timezone: "Asia/Jerusalem" 
    };

    // --- The Sync Task ---
    // The cron expression '0 3 * * *' means: Run at 03:00 AM every day.
    // Tip: If you want to test it RIGHT NOW to see if it works, 
    // change it temporarily to '* * * * *' (which means: Run every minute).
    cron.schedule('0 3 * * *', async () => {
        console.log(`\n🔄 [CRON - ${new Date().toLocaleString()}] Starting daily government API sync...`);
        
        try {
            await syncLotteriesData();
            console.log('✅ [CRON - Step 1] Lotteries sync completed.');

            console.log('🔄 [CRON - Step 2] Starting Geocoding for new cities...');
            await syncCityCoordinates();
            console.log('✅ [CRON - Step 2] Geocoding sync completed.');

            console.log('🎉 [CRON] Entire Data Pipeline finished successfully!');

        } catch (error) {
            console.error('❌ [CRON] Daily sync failed:', error);
        }
        
    }, timezoneConfig);
};