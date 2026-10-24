import express from 'express';
import authController from '../controllers/authController.js';
import { verifyToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Endpoint Publik
router.post('/register', authController.register);
router.post('/login', authController.login);

// Endpoint Terproteksi (Membutuhkan Bearer Token)
router.get('/me', verifyToken, authController.getMe);
router.get('/users', verifyToken, authController.getUsers);
router.post('/users', verifyToken, authController.createUser);
router.put('/users/:id', verifyToken, authController.updateUser);
router.delete('/users/:id', verifyToken, authController.deleteUser);

export default router;
