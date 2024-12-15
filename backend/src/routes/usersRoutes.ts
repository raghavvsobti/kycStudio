import express from 'express';
import {
    getUser,
    getUsers
} from '../controllers/usersController';
import isAdmin from '../middlewares/isAdmin';
import isAuthenticated from '../middlewares/isAuthenticated';

const router = express.Router();

router.get('/user/:id', isAuthenticated, getUser);  
router.get('/users', isAuthenticated, isAdmin, getUsers);    

export default router;