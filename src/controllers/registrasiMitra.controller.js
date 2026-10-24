import registrasiMitraService from '../services/registrasiMitra.service.js';

class RegistrasiMitraController {
  async getRequirements(req, res, next) {
    try {
      const data = await registrasiMitraService.getAllMitraRequirements();
      res.json({
        success: true,
        message: 'Berhasil mengambil data persyaratan mitra',
        data,
      });
    } catch (error) {
      console.error(error.original || error);
      return res.status(500).json({
        success: false,
        message: error.message || 'Gagal mengambil data persyaratan mitra',
      });
    }
  }

  async getUpiNoregList(req, res, next) {
    try {
      const { page, limit, search, negara, status } = req.query;
      const result = await registrasiMitraService.getPaginatedUpiNoreg({
        page,
        limit,
        search,
        negara,
        status,
      });
      res.json({
        success: true,
        message: 'Berhasil mengambil data direktori UPI Noreg',
        data: result.data,
        pagination: result.pagination,
      });
    } catch (error) {
      console.error(error.original || error);
      return res.status(500).json({
        success: false,
        message: error.message || 'Gagal mengambil data direktori UPI Noreg',
      });
    }
  }

  async getCountries(req, res, next) {
    try {
      const data = await registrasiMitraService.getAvailableCountries();
      res.json({
        success: true,
        message: 'Berhasil mengambil daftar negara mitra',
        data,
      });
    } catch (error) {
      console.error(error.original || error);
      return res.status(500).json({
        success: false,
        message: error.message || 'Gagal mengambil daftar negara mitra',
      });
    }
  }
}

export default new RegistrasiMitraController();
