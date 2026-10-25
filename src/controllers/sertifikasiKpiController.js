import sertifikasiKpiService from '../services/sertifikasiKpiService.js';

class SertifikasiKpiController {
  /**
   * Endpoint publik KPI Sertifikasi Nasional (tanpa auth).
   * GET /api/v1/public/sertifikasi-kpi?year=2026 (atau ?tahun=2026)
   * Jika year tidak dikirim atau bernilai 'all', kembali data all-time.
   */
  async getKpiNasional(req, res) {
    try {
      const year = req.query.year ?? req.query.tahun ?? null;
      const result = await sertifikasiKpiService.getKpiNasional(year);
      return res.json(result);
    } catch (error) {
      console.error('[SertifikasiKpi Controller Error]:', error);
      return res.status(500).json({
        success: false,
        message: 'Gagal mengambil data KPI sertifikasi nasional',
        ...(process.env.NODE_ENV === 'development' && { detail: error.message }),
      });
    }
  }
}

export default new SertifikasiKpiController();
