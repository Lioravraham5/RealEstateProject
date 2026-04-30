import pool from '../config/db.js';

export const upsertLottery = async (values) => {
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
    
    await pool.query(query, values);
};