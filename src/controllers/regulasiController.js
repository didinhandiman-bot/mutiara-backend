import regulasiService from '../services/regulasiService.js';

class RegulasiController {
  // 1. GET /regulasi
  async getRegulasi(req, res) {
    try {
      const { jenis, search, featured, page, limit } = req.query;
      const result = await regulasiService.getRegulasi({ jenis, search, featured, page, limit });

      return res.status(200).json({
        success: true,
        message: 'Berhasil mengambil data regulasi',
        data: result
      });
    } catch (error) {
      console.error('Error getRegulasi:', error);
      return res.status(500).json({
        success: false,
        message: 'Gagal mengambil data regulasi'
      });
    }
  }

  // 2. GET /regulasi/:id
  async getRegulasiById(req, res) {
    try {
      const { id } = req.params;
      const data = await regulasiService.getRegulasiById(id);

      if (!data) {
        return res.status(404).json({
          success: false,
          message: 'Data regulasi tidak ditemukan'
        });
      }

      return res.status(200).json({
        success: true,
        message: 'Berhasil mengambil detail regulasi',
        data
      });
    } catch (error) {
      console.error('Error getRegulasiById:', error);
      return res.status(500).json({
        success: false,
        message: 'Gagal mengambil detail regulasi'
      });
    }
  }

  // 3. POST /regulasi/:id/download
  async trackDownload(req, res) {
    try {
      const { id } = req.params;
      await regulasiService.trackDownload(id);

      return res.status(200).json({
        success: true,
        message: 'Berhasil mencatat unduhan regulasi',
        data: { id }
      });
    } catch (error) {
      console.error('Error trackDownload:', error);
      return res.status(500).json({
        success: false,
        message: 'Gagal mencatat unduhan regulasi'
      });
    }
  }
}

export default new RegulasiController();
