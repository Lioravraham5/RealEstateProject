import pool from '../config/db.js';

/**
 * Service to fetch and store geographic coordinates for cities.
 * This enables map-based features in the frontend.
 */
const syncCityCoordinates = async () => {
    try {
        // 1. Initialize the storage table if it doesn't exist.
        // Using DECIMAL(10, 8) for high precision mapping.
        await pool.query(`
            CREATE TABLE IF NOT EXISTS city_locations (
                city VARCHAR(255) PRIMARY KEY,
                lat DECIMAL(10, 8),
                lng DECIMAL(11, 8)
            );
        `);
        console.log('City locations table is ready.');

        // 2. Identify cities from the lotteries table that are missing coordinates.
        // We use a LEFT JOIN and filter by NULL to find only new/unprocessed cities.
        const query = `
            SELECT DISTINCT l.city 
            FROM lotteries l
            LEFT JOIN city_locations c ON l.city = c.city
            WHERE c.city IS NULL;
        `;
        const { rows } = await pool.query(query);
        
        if (rows.length === 0) {
            console.log('✨ All cities already have coordinates! Skipping sync.');
            return;
        }

        console.log(`🌍 Found ${rows.length} new cities. Fetching coordinates from OpenStreetMap...`);

        // 3. Process each new city through the Geocoding API.
        for (const row of rows) {
            const city = row.city;
            // Best Practice: Use encodeURIComponent to safely include city names in the URL, especially if they contain Hebrew letters, spaces or special characters.
            const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(city + ', Israel')}`;
            
            /** * BEST PRACTICE: Rate Limiting
             * OpenStreetMap's usage policy requires a delay between requests.
             * 1.5 seconds delay prevents our IP from being blacklisted.
             */
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            // Nominatim API requires a custom User-Agent header to identify the request source.
            const response = await fetch(url, { 
                headers: { 'User-Agent': 'RealEstateBackend/1.0' } 
            });
            const data = await response.json();

            // If the city is found, persist the first (most relevant) result to the DB.
            if (data && data.length > 0) {
                const { lat, lon } = data[0];
                await pool.query(
                    'INSERT INTO city_locations (city, lat, lng) VALUES ($1, $2, $3)',
                    [city, lat, lon]
                );
                console.log(`Geocoded: ${city} -> Lat: ${lat}, Lng: ${lon}`);
            } else {
                console.log(`Coordinate lookup failed for: ${city}`);
            }
        }
        console.log('Geocoding sync completed successfully!');
    } catch (error) {
        console.error('Error during geocoding process:', error.message);
    }
};

/**
 * CLI Execution block
 */
if (process.argv[1].endsWith('geocodeService.js')) {
    syncCityCoordinates().then(() => {
        pool.end();
        console.log('Geocoding pool closed.');
    });
}