const express = require('express');
const router = express.Router();
const regulasiController = require('../controllers/regulasiController');

// Endpoint Publik (tanpa verifyToken)
router.get('/', regulasiController.getRegulasi);
router.get('/:id', regulasiController.getRegulasiById);
router.post('/:id/download', regulasiController.trackDownload);

module.exports = router;
