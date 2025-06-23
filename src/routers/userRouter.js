import express from 'express';
import userController from '../controllers/userController.js';

const router = express.Router();

// POST route to create a new user
router.post('/create', userController.createUser);

// GET route to fetch all users
router.get('/all', userController.getAllUsers);

export default router;
