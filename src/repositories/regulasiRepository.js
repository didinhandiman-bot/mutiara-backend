const db = require('../config/database');

class RegulasiRepository {
  // 1. Ambil daftar regulasi aktif dengan filter dan pagination
  async findAll({ jenis, search, featured, limit, offset }) {
    let params = [];
    let where = 'WHERE is_active = 1';

    if (jenis) {
      where += ' AND jenis = ?';
      params.push(jenis);
    }

    if (search) {
      where += ' AND (kode LIKE ? OR judul LIKE ? OR deskripsi LIKE ?)';
      const like = `%${search}%`;
      params.push(like, like, like);
    }

    if (featured) {
      where += ' AND is_featured = 1';
    }

    // Hitung total data untuk pagination
    const [countRows] = await db.query(
      `SELECT COUNT(*) AS total FROM laboratorium.tb_regulasi ${where}`,
      params
    );
    const total = countRows[0].total;

    // Ambil data dengan pagination dan pengurutan
    const [rows] = await db.query(
      `SELECT id, kode, judul, deskripsi, jenis, kategori, tahun, file_url, file_size,
              is_featured, is_active, download_count, urutan, created_at, updated_at
       FROM laboratorium.tb_regulasi ${where}
       ORDER BY is_featured DESC, urutan ASC, tahun DESC, id DESC
       LIMIT ? OFFSET ?`,
      [...params, Number(limit), Number(offset)]
    );

    return { data: rows, total };
  }

  // 2. Ambil 1 baris regulasi aktif berdasarkan ID
  async findById(id) {
    const [rows] = await db.query(
      `SELECT id, kode, judul, deskripsi, jenis, kategori, tahun, file_url, file_size,
              is_featured, is_active, download_count, urutan, created_at, updated_at
       FROM laboratorium.tb_regulasi
       WHERE id = ? AND is_active = 1`,
      [id]
    );
    return rows[0] || null;
  }

  // 3. Tambah hitungan download_count sebanyak 1
  async incrementDownload(id) {
    const [result] = await db.query(
      `UPDATE laboratorium.tb_regulasi SET download_count = download_count + 1 WHERE id = ?`,
      [id]
    );
    return result;
  }
}

module.exports = new RegulasiRepository();
