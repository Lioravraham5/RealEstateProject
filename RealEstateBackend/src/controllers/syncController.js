import { syncLotteriesData } from '../services/syncService.js';
import { syncCityCoordinates } from '../services/geocodeService.js'; 

export const triggerSync = async (req, res) => {
    const secret = req.query.secret;

    // 1. Verify the secret token to ensure that only authorized requests can trigger the sync process. This is crucial for security, especially if this endpoint is exposed to the internet.
    if (secret !== process.env.CRON_SECRET) {
        console.warn('⚠️ Unauthorized sync attempt blocked.');
        return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    console.log(`\n🔄 [WEBHOOK - ${new Date().toLocaleString()}] Starting external sync...`);

    // 2. Immediately respond to the client to acknowledge the request, while the actual sync process continues in the background. 
    res.status(200).json({ success: true, message: 'Sync process started in the background.' });

    // 3. Execute the sync process in the background. This allows the server to handle the potentially long-running sync operation without blocking the response to the client. The sync process includes both fetching and updating lottery data and geocoding new cities.
    try {
        await syncLotteriesData();
        console.log('✅ [WEBHOOK - Step 1] Lotteries sync completed.');

        console.log('🔄 [WEBHOOK - Step 2] Starting Geocoding for new cities...');
        await syncCityCoordinates();
        console.log('✅ [WEBHOOK - Step 2] Geocoding sync completed.');

        console.log('🎉 [WEBHOOK] Entire Data Pipeline finished successfully!');
    } catch (error) {
        console.error('❌ [WEBHOOK] Sync failed:', error);
    }
};