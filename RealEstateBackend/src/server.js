import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import lotteryRoutes from './routes/lotteryRoutes.js';
import statsRoutes from './routes/statsRoutes.js';
import { startCronJobs } from './services/cronJob.js';

// Load environment variables from .env file
dotenv.config();

// Create an Express application - the main server instance
const app = express();
const PORT = process.env.PORT || 5000;

// --- Middlewares ---
// CORS allows our future frontend (React/Android) to communicate with this API
app.use(cors()); 
// Allows Express to parse incoming JSON data
app.use(express.json());

// --- Routes ---
// Mount the lottery routes on the '/api/lotteries' path
app.use('/api/lotteries', lotteryRoutes);
app.use('/api/stats', statsRoutes);

// A simple health-check route to verify the server is running
app.get('/', (req, res) => {
    res.send('Real Estate API is running... ');
});

// --- Start Background Tasks ---
// Initialize the CRON jobs scheduler before the server starts
startCronJobs();

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT} in development mode.`);
});