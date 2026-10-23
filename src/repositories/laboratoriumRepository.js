const db = require('../config/database');

class LaboratoriumRepository {
  // 1. Ambil seluruh titik laboratorium yang memiliki koordinat
  async getAllMapMarkers() {
    const [rows] = await db.query(`
      SELECT 
          r.KD_UNIT AS kd_unit,
          COALESCE(r.NM_PENDEK_BARU, u.nama_lembaga) AS nama_lab,
          r.NM_UNIT_BARU AS nama_lengkap,
          r.KOTA AS kota,
          CAST(REPLACE(TRIM(r.BUJUR), '¶', '') AS DECIMAL(10, 7)) AS latitude,
          CAST(REPLACE(TRIM(r.LINTANG), '¶', '') AS DECIMAL(11, 7)) AS longitude,
          u.telepon,
          u.email,
          u.pic_nama,
          u.pic_kontak,
          a.nomor_akreditasi,
          COUNT(DISTINCT ku.parameter_id) AS total_parameter,
          GROUP_CONCAT(DISTINCT k.nama_kategori ORDER BY k.nama_kategori SEPARATOR ', ') AS kategori_uji
      FROM tb_r_upt r
      LEFT JOIN upt_lembaga u ON r.KD_UNIT = u.kd_unit
      LEFT JOIN upt_akreditasi a ON u.id = a.upt_id
      LEFT JOIN upt_kemampuan_uji ku ON u.id = ku.upt_id
      LEFT JOIN parameter_uji p ON ku.parameter_id = p.id
      LEFT JOIN kategori_uji k ON p.kategori_id = k.id
      WHERE r.BUJUR IS NOT NULL 
        AND r.LINTANG IS NOT NULL
        AND TRIM(r.BUJUR) != ''
        AND TRIM(r.LINTANG) != ''
      GROUP BY r.KD_UNIT, u.id, a.id
      ORDER BY r.KD_UNIT ASC;
    `);

    return rows;
  }

  // 2. Ambil profil detail dan akreditasi laboratorium berdasarkan kode unit
  async getDetailByKdUnit(kdUnit) {
    const [rows] = await db.query(
      `
      SELECT 
          r.KD_UNIT AS kd_unit,
          COALESCE(r.NM_PENDEK_BARU, u.nama_lembaga) AS nama_lab,
          r.NM_UNIT_BARU AS nama_lengkap,
          COALESCE(u.alamat, r.ALAMAT_UNIT) AS alamat,
          r.KOTA AS kota,
          CAST(REPLACE(TRIM(r.BUJUR), '¶', '') AS DECIMAL(10, 7)) AS latitude,
          CAST(REPLACE(TRIM(r.LINTANG), '¶', '') AS DECIMAL(11, 7)) AS longitude,
          u.telepon,
          u.email,
          u.pic_nama,
          u.pic_kontak,
          a.nomor_akreditasi,
          a.keterangan AS masa_akreditasi,
          COUNT(DISTINCT ku.parameter_id) AS total_parameter
      FROM tb_r_upt r
      LEFT JOIN upt_lembaga u ON r.KD_UNIT = u.kd_unit
      LEFT JOIN upt_akreditasi a ON u.id = a.upt_id
      LEFT JOIN upt_kemampuan_uji ku ON u.id = ku.upt_id
      WHERE r.KD_UNIT = ?
      GROUP BY r.KD_UNIT, u.id, a.id;
      `,
      [kdUnit]
    );

    return rows[0] || null;
  }

  // 3. Ambil daftar parameter uji yang diakreditasi untuk modal/tabel popup
  async getParametersByKdUnit(kdUnit) {
    const [rows] = await db.query(
      `
      SELECT 
          k.nama_kategori,
          p.nama_parameter,
          COALESCE(ku.metode_khusus, p.metode_acuan) AS metode_uji,
          ku.status_akreditasi
      FROM upt_kemampuan_uji ku
      JOIN upt_lembaga u ON ku.upt_id = u.id
      JOIN parameter_uji p ON ku.parameter_id = p.id
      JOIN kategori_uji k ON p.kategori_id = k.id
      WHERE u.kd_unit = ?
      ORDER BY k.nama_kategori ASC, p.nama_parameter ASC;
      `,
      [kdUnit]
    );

    return rows;
  }
}

module.exports = new LaboratoriumRepository();
