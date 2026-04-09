import express from 'express';
import { getCityDistribution } from '../controllers/statsController.js';

const router = express.Router();

// Route for the map coordinates dictionary
router.get('/cities', getCityDistribution);

export default router;