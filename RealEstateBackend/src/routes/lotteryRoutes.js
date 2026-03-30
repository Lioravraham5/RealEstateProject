import express from 'express';
import { getAllLotteries } from '../controllers/lotteryController.js';

const router = express.Router();

// When a GET request hits the root of this router ('/'), run the controller
router.get('/', getAllLotteries);

export default router;