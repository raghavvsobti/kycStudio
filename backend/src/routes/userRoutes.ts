import express from 'express';
import {
    registerUser,
    loginUser,
    getUser,
    getUsers,
    postKYCForm,
} from '../controllers/userController';

const router = express.Router();

router.post('/register', registerUser); // Register User
router.post('/login', loginUser);       // Login User
router.get('/get/user/:id', getUser);  // Get Single User
router.get('/get/users', getUsers);    // Get All Users
router.post('/post/kycform/:id', postKYCForm); // Submit KYC Form

export default router;
