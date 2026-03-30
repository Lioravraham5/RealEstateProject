import pool from '../config/db.js';

export const getAllLotteries = async (req, res) => {
    try {
        // Extract query parameters for filtering and sorting
        const { city, status, min_price, max_price, sort } = req.query;

        // Best Practice: Start with a base query and then conditionally add filters based on the presence of query parameters.
        let queryStr = `
            SELECT 
                *,
                ROUND((total_units::numeric / NULLIF(total_subscribers, 0)) * 100, 2) AS win_probability
            FROM lotteries
            WHERE 1=1
        `;
        
        const values = [];
        let valueIndex = 1; // To keep track of parameterized query placeholders ($1, $2, etc.)

        // Add filters based on query parameters
        if (city) {
            queryStr += ` AND city = $${valueIndex}`;
            values.push(city);
            valueIndex++;
        }

        if (status) {
            queryStr += ` AND status = $${valueIndex}`;
            values.push(status);
            valueIndex++;
        }

        if (min_price) {
            queryStr += ` AND price_per_meter >= $${valueIndex}`;
            values.push(min_price);
            valueIndex++;
        }

        if (max_price) {
            queryStr += ` AND price_per_meter <= $${valueIndex}`;
            values.push(max_price);
            valueIndex++;
        }

        // Add sorting based on the 'sort' query parameter
        if (sort === 'probability_desc') {
            queryStr += ` ORDER BY win_probability DESC NULLS LAST`;  // Sort by calculated win probability, placing NULLs last
        } else if (sort === 'price_asc') {
            queryStr += ` ORDER BY price_per_meter ASC NULLS LAST`; // Sort by price ascending, placing NULLs last
        } else if (sort === 'units_desc') {
            queryStr += ` ORDER BY total_units DESC`; // Sort by total units descending
        } else {
            queryStr += ` ORDER BY lottery_id DESC`; // Default sorting by lottery_id descending
        }

        // Execute the parameterized query to prevent SQL Injection
        const result = await pool.query(queryStr, values);
        
        res.status(200).json({
            success: true,
            count: result.rowCount,
            data: result.rows
        });
    } catch (error) {
        console.error('Error fetching lotteries:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};