import express from 'express';
import registrasiMitraController from '../controllers/registrasiMitra.controller.js';

const router = express.Router();

router.get('/requirements', registrasiMitraController.getRequirements);
router.get('/upinoreg', registrasiMitraController.getUpiNoregList);
router.get('/countries', registrasiMitraController.getCountries);

export default router;
