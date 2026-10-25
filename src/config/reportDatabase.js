import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const reportConfig = {
  host: process.env.DB_REPORT_HOST || 'localhost',
  port: Number(process.env.DB_REPORT_PORT) || 3306,
  user: process.env.DB_REPORT_USER || 'root',
  password: process.env.DB_REPORT_PASS || '',
  dialect: 'mysql',
  logging: false,
  pool: { max: 10, min: 2, acquire: 30000, idle: 10000 },
};

/**
 * Koneksi ke database report_skp (tabel tb_skp_paska - Sertifikasi Kelayakan Pengolahan / Pasca Panen).
 */
export const dbReportSkp = new Sequelize(
  process.env.DB_REPORT_SKP_NAME || 'report_skp',
  reportConfig.user,
  reportConfig.password,
  { ...reportConfig, host: process.env.DB_REPORT_SKP_HOST || reportConfig.host, port: Number(process.env.DB_REPORT_SKP_PORT) || reportConfig.port }
);

/**
 * Koneksi ke database report_primer (tabel tr_laporan_primer_export - Perizinan Primer).
 */
export const dbReportPrimer = new Sequelize(
  process.env.DB_REPORT_PRIMER_NAME || 'report_primer',
  reportConfig.user,
  reportConfig.password,
  { ...reportConfig, host: process.env.DB_REPORT_PRIMER_HOST || reportConfig.host, port: Number(process.env.DB_REPORT_PRIMER_PORT) || reportConfig.port }
);

/**
 * Koneksi ke database report_haccp (view vw07_sertifikasi - HACCP).
 */
export const dbReportHaccp = new Sequelize(
  process.env.DB_REPORT_HACCP_NAME || 'report_haccp',
  reportConfig.user,
  reportConfig.password,
  { ...reportConfig, host: process.env.DB_REPORT_HACCP_HOST || reportConfig.host, port: Number(process.env.DB_REPORT_HACCP_PORT) || reportConfig.port }
);

/**
 * Koneksi ke database report_kapal (tabel tb_cbib_kapal - CPIB Kapal).
 */
export const dbReportKapal = new Sequelize(
  process.env.DB_REPORT_KAPAL_NAME || 'report_kapal',
  reportConfig.user,
  reportConfig.password,
  { ...reportConfig, host: process.env.DB_REPORT_KAPAL_HOST || reportConfig.host, port: Number(process.env.DB_REPORT_KAPAL_PORT) || reportConfig.port }
);

/**
 * Koneksi ke database report_spdi (tabel untuk SPDI - Sertifikasi Pengolahan Ikan).
 */
export const dbReportSpdi = new Sequelize(
  process.env.DB_REPORT_SPDI_NAME || 'report_spdi',
  reportConfig.user,
  reportConfig.password,
  { ...reportConfig, host: process.env.DB_REPORT_SPDI_HOST || reportConfig.host, port: Number(process.env.DB_REPORT_SPDI_PORT) || reportConfig.port }
);

export const testReportConnections = async () => {
  const connections = [
    { name: 'report_skp', instance: dbReportSkp },
    { name: 'report_primer', instance: dbReportPrimer },
    { name: 'report_haccp', instance: dbReportHaccp },
    { name: 'report_kapal', instance: dbReportKapal },
    { name: 'report_spdi', instance: dbReportSpdi },
  ];
  for (const { name, instance } of connections) {
    try {
      await instance.authenticate();
      console.log(`✅ Koneksi ke ${name} berhasil.`);
    } catch (error) {
      console.error(`⚠️  Gagal terkoneksi ke ${name}:`, error.message);
    }
  }
};

export default {
  dbReportSkp,
  dbReportPrimer,
  dbReportHaccp,
  dbReportKapal,
  dbReportSpdi,
  testReportConnections,
};
