import express from 'express';
import regulasiController from '../controllers/regulasiController.js';

const router = express.Router();

// Endpoint Publik (tanpa verifyToken)
router.get('/', regulasiController.getRegulasi);
router.get('/:id', regulasiController.getRegulasiById);
router.post('/:id/download', regulasiController.trackDownload);

export default router;
