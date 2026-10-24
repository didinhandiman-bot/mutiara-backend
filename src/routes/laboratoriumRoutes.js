import express from 'express';
import laboratoriumController from '../controllers/laboratoriumController.js';

const router = express.Router();

// Endpoint Publik (tanpa verifyToken)
// Urutan penting: '/peta' harus didaftarkan sebelum '/:kd_unit'
router.get('/peta', laboratoriumController.getPeta);
router.get('/:kd_unit', laboratoriumController.getDetail);

export default router;
