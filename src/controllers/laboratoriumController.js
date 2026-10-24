import laboratoriumService from '../services/laboratoriumService.js';

class LaboratoriumController {
  // 1. GET /laboratorium/peta
  async getPeta(req, res) {
    try {
      const data = await laboratoriumService.getPetaLaboratorium();

      return res.status(200).json({
        success: true,
        message: 'Berhasil mengambil data peta sebar laboratorium',
        data
      });
    } catch (error) {
      console.error('Error getPeta:', error);
      return res.status(500).json({
        success: false,
        message: 'Gagal mengambil data peta sebar laboratorium'
      });
    }
  }

  // 2. GET /laboratorium/:kd_unit
  async getDetail(req, res) {
    try {
      const { kd_unit: kdUnit } = req.params;
      const data = await laboratoriumService.getDetailLaboratorium(kdUnit);

      if (!data) {
        return res.status(404).json({
          success: false,
          message: 'Data laboratorium tidak ditemukan'
        });
      }

      return res.status(200).json({
        success: true,
        message: 'Berhasil mengambil detail laboratorium',
        data
      });
    } catch (error) {
      console.error('Error getDetail:', error);
      return res.status(500).json({
        success: false,
        message: 'Gagal mengambil detail laboratorium'
      });
    }
  }
}

export default new LaboratoriumController();
