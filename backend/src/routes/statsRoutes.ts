import express from 'express';
import { getStats } from '../controllers/statsController';
import isAuthenticated from '../middlewares/isAuthenticated';
import isAdmin from '../middlewares/isAdmin';

const router = express.Router();

router.post('/stats', isAuthenticated, isAdmin, getStats); 

export default router;