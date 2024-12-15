import express from 'express';
import isAuthenticated from '../middlewares/isAuthenticated';
import { loginUser, logoutUser, registerUser } from '../controllers/authController';

const router = express.Router();

router.post('/register', registerUser); 
router.post('/login', loginUser);       
router.post('/logout',isAuthenticated, logoutUser);       

export default router;