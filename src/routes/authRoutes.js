const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { verifyToken } = require('../middlewares/authMiddleware');

// Endpoint Publik
router.post('/register', authController.register);
router.post('/login', authController.login);

// Endpoint Terproteksi (Membutuhkan Bearer Token)
router.get('/me', verifyToken, authController.getMe);
router.get('/users', verifyToken, authController.getUsers);
router.post('/users', verifyToken, authController.createUser);
router.put('/users/:id', verifyToken, authController.updateUser);
router.delete('/users/:id', verifyToken, authController.deleteUser);

module.exports = router;