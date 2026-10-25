import express from 'express';
import sertifikasiKpiController from '../controllers/sertifikasiKpiController.js';

const router = express.Router();

// Endpoint publik KPI Sertifikasi Nasional (tanpa auth)
router.get('/sertifikasi-kpi', sertifikasiKpiController.getKpiNasional);

export default router;
