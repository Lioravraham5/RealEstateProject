import express from 'express';
import { getConstructionStatusStats, getCityDistribution } from '../controllers/statsController.js';

const router = express.Router();

// When a GET request hits '/construction-status', run the controller
router.get('/construction-status', getConstructionStatusStats);

// Route for the map / geographic distribution
router.get('/cities', getCityDistribution);

export default router;