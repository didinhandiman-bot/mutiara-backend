import regulasiRepository from '../repositories/regulasiRepository.js';

class RegulasiService {
  // 1. Ambil daftar regulasi dengan validasi parameter dan pagination
  async getRegulasi({ jenis, search, featured, page, limit }) {
    const currentPage = Math.max(parseInt(page) || 1, 1);
    const currentLimit = Math.max(parseInt(limit) || 10, 1);
    const offset = (currentPage - 1) * currentLimit;

    const result = await regulasiRepository.findAll({
      jenis,
      search,
      featured,
      limit: currentLimit,
      offset
    });

    return {
      data: result.data,
      total: result.total,
      page: currentPage,
      limit: currentLimit,
      totalPages: Math.ceil(result.total / currentLimit)
    };
  }

  // 2. Ambil detail regulasi berdasarkan ID
  async getRegulasiById(id) {
    const regulasi = await regulasiRepository.findById(id);
    if (!regulasi) return null;
    return regulasi;
  }

  // 3. Catat penambahan download_count saat file diunduh
  async trackDownload(id) {
    await regulasiRepository.incrementDownload(id);
    return { id };
  }
}

export default new RegulasiService();
