import pool from '../config/db.js';

// Controller to get geographic dictionary (City names and Coordinates only!)
export const getCityDistribution = async (req, res) => {
    try {
        // Best Practice: The server is now dumb and fast. 
        // It just returns the raw coordinates. React does all the heavy math!
        const query = `
            SELECT city, lat, lng 
            FROM city_locations;
        `;
        const result = await pool.query(query);
        
        res.status(200).json({
            success: true,
            data: result.rows
        });
    } catch (error) {
        console.error('Error fetching city locations:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};