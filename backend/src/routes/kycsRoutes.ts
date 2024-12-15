import express from 'express';
import { postKYCForm, updateKycStatus } from '../controllers/kycsController';
import isAuthenticated from '../middlewares/isAuthenticated';
import isAdmin from '../middlewares/isAdmin';

const router = express.Router();

router.post('/kycform/:id',
	// isAuthenticated,
	postKYCForm
); 
router.post('/update/kycstatus/:id', isAuthenticated, isAdmin, updateKycStatus); 

export default router;