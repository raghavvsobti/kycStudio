import express from 'express';
import {
    registerUser,
    loginUser,
    getUser,
    getUsers,
} from '../controllers/usersController';
import isAuthenticated from '../middlewares/isAuthenticated';
import isAdmin from '../middlewares/isAdmin';

const router = express.Router();

router.post('/register', registerUser); 
router.post('/login', loginUser);       
router.get('/user/:id', isAuthenticated, getUser);  
router.get('/users', isAuthenticated, isAdmin, getUsers);    

export default router;