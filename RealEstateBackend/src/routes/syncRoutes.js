import express from 'express';
import { triggerSync } from '../controllers/syncController.js';

const router = express.Router();

// This route will be called by cron-job.org to trigger the sync process. It expects a secret token as a query parameter for security.
router.get('/trigger', triggerSync);

export default router;