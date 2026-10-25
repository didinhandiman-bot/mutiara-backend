import { QueryTypes } from 'sequelize';
import {
  dbReportSkp,
  dbReportPrimer,
  dbReportHaccp,
  dbReportKapal,
  dbReportSpdi,
} from '../config/reportDatabase.js';

/**
 * Repository untuk KPI Sertifikasi (landing page).
 *
 * Tanggung jawab HANYA komunikasi database: menyusun SQL COUNT/agregasi,
 * mengirim replacement, dan mengembalikan baris mentah. Tidak ada rumus bisnis
 * di sini. Semua query dibaca secara nasional (tanpa filter scope UPT / tanpa
 * auth middleware).
 *
 * Pola query mengikuti referensi bppmhkp-portal-backend (raw SQL +
 * replacements, bukan model Sequelize).
 *
 * Setiap method menerima parameter `year` (string | null). Jika `year` null
 * atau 'all', query tidak difilter tahun (all-time).
 */

const KODE_IZIN_PRIMER = Object.freeze([
  '032000000014', // CPPIB
  '032000000034', // CPIB
  '032000000036', // CDOIB
  '032000000068', // CBIB
  '032000000033', // CPIB Kapal (di report_kapal, bukan di sini)
  '032000000019', // CPOIB
  '032000000087', // CDOIB (alias)
]);

/**
 * Membangun klausa WHERE tahun + replacements jika year valid.
 * @param {string|null} year
 * @param {string} dateColumn Nama kolom tanggal di tabel sumber.
 * @returns {{ where: string, replacements: Object }}
 */
function buildYearFilter(year, dateColumn) {
  const replacements = {};
  let where = '';
  if (year && String(year).toLowerCase() !== 'all') {
    replacements.year = Number(year);
    where = `WHERE YEAR(${dateColumn}) = :year`;
  }
  return { where, replacements };
}

class SertifikasiKpiRepository {
  /**
   * Hitung total SKP dari tb_skp_paska (report_skp).
   * Kolom tanggal: `tanggal_terbit`.
   */
  static async countSkp(year = null) {
    const { where, replacements } = buildYearFilter(year, 'tanggal_terbit');
    const rows = await dbReportSkp.query(
      `SELECT COUNT(*) AS total FROM tb_skp_paska ${where}`,
      { replacements, type: QueryTypes.SELECT }
    );
    return Number(rows[0]?.total ?? 0);
  }

  /**
   * Hitung total HACCP dari vw07_sertifikasi (report_haccp).
   * Kolom tanggal: `tgl_terbit`.
   */
  static async countHaccp(year = null) {
    const { where, replacements } = buildYearFilter(year, 'tgl_terbit');
    const rows = await dbReportHaccp.query(
      `SELECT COUNT(*) AS total FROM vw07_sertifikasi ${where}`,
      { replacements, type: QueryTypes.SELECT }
    );
    return Number(rows[0]?.total ?? 0);
  }

  /**
   * Hitung total SPDI dari tabel SPDI (report_spdi).
   * Jika tabel tidak tersedia, kembali 0 agar tidak mem-block endpoint.
   */
  static async countSpdi(year = null) {
    try {
      const { where, replacements } = buildYearFilter(year, 'tgl_terbit');
      const rows = await dbReportSpdi.query(
        `SELECT COUNT(*) AS total FROM tb_spdi ${where}`,
        { replacements, type: QueryTypes.SELECT }
      );
      return Number(rows[0]?.total ?? 0);
    } catch (error) {
      // Tabel SPDI mungkin belum tersedia di semua environment.
      return 0;
    }
  }

  /**
   * Hitung total perizinan primer per kd_izin dari tr_laporan_primer_export (report_primer).
   * Mengembalikan object { CPIB, CBIB, CPPIB, CPOIB, CDOIB }.
   * Kolom tanggal: `tgl_izin`.
   */
  static async countPrimerByIzin(year = null) {
    const queries = {
      CPIB: '032000000034',
      CBIB: '032000000068',
      CPPIB: '032000000014',
      CPOIB: '032000000019',
      CDOIB: '032000000087',
    };

    const { where, replacements: baseReplacements } = buildYearFilter(
      year,
      'tgl_izin'
    );
    const yearAndCondition = where ? ` AND ${where.replace(/^WHERE /i, '')}` : '';

    const results = {};
    await Promise.all(
      Object.entries(queries).map(async ([label, kdIzin]) => {
        const replacements = { ...baseReplacements, kdIzin };
        const rows = await dbReportPrimer.query(
          `SELECT COUNT(*) AS total FROM tr_laporan_primer_export WHERE kd_izin = :kdIzin${yearAndCondition}`,
          { replacements, type: QueryTypes.SELECT }
        );
        results[label] = Number(rows[0]?.total ?? 0);
      })
    );

    return results;
  }

  /**
   * Hitung total CPIB Kapal dari tb_cbib_kapal (report_kapal).
   * Kolom tanggal: `tgl_terbit`.
   */
  static async countKapal(year = null) {
    const { where, replacements } = buildYearFilter(year, 'tgl_terbit');
    const rows = await dbReportKapal.query(
      `SELECT COUNT(*) AS total FROM tb_cbib_kapal ${where}`,
      { replacements, type: QueryTypes.SELECT }
    );
    return Number(rows[0]?.total ?? 0);
  }
}

export default SertifikasiKpiRepository;
