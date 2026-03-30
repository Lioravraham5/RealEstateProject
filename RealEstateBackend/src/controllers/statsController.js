import pool from '../config/db.js';

// Controller to get construction status distribution
export const getConstructionStatusStats = async (req, res) => {
    try {
        // Best Practice: Let the Database do the heavy lifting!
        // We group the lotteries by their status and count them.
        // The ::int casts the count to a regular number instead of a string.
        const query = `
            SELECT status, COUNT(*)::int as count 
            FROM lotteries 
            GROUP BY status 
            ORDER BY count DESC;
        `;
        const result = await pool.query(query);
        
        res.status(200).json({
            success: true,
            data: result.rows
        });
    } catch (error) {
        console.error('Error fetching construction stats:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// Controller to get geographic distribution of lotteries
export const getCityDistribution = async (req, res) => {
    try {
        // Best Practice: Joining the aggregated data with our new coordinates table
        const query = `
            SELECT 
                l.city, 
                COUNT(l.*)::int as project_count,
                COALESCE(SUM(l.total_units), 0)::int as total_apartments,
                c.lat,
                c.lng
            FROM lotteries l
            LEFT JOIN city_locations c ON l.city = c.city
            GROUP BY l.city, c.lat, c.lng
            ORDER BY project_count DESC;
        `;
        const result = await pool.query(query);
        
        res.status(200).json({
            success: true,
            data: result.rows
        });
    } catch (error) {
        console.error('Error fetching city distribution:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};