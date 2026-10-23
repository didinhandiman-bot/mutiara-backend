const express = require('express');
const router = express.Router();
const laboratoriumController = require('../controllers/laboratoriumController');

// Endpoint Publik (tanpa verifyToken)
// Urutan penting: '/peta' harus didaftarkan sebelum '/:kd_unit'
router.get('/peta', laboratoriumController.getPeta);
router.get('/:kd_unit', laboratoriumController.getDetail);

module.exports = router;
