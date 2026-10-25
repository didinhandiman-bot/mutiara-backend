import SertifikasiKpiRepository from '../repositories/sertifikasiKpi.repository.js';

/**
 * Memory cache sederhana dengan TTL untuk KPI Sertifikasi.
 * Tujuan: landing page cepat dan query multi-db tidak membebani database
 * setiap kali di-refresh. TTL default 15 menit (900000 ms).
 *
 * Cache dipisahkan per tahun (`kpi_nasional_<year>` atau `kpi_nasional_all`)
 * sehingga filter tahun yang berbeda tidak menimpa data satu sama lain.
 */
const CACHE_TTL_MS = Number(process.env.SERTIFIKASI_KPI_CACHE_TTL_MS) || 15 * 60 * 1000;

const cache = {};

function cacheKey(year) {
  return `kpi_nasional_${year || 'all'}`;
}

function isCacheValid(key) {
  const entry = cache[key];
  return !!entry && Date.now() < entry.expiry;
}

function setCache(key, data) {
  cache[key] = {
    data,
    expiry: Date.now() + CACHE_TTL_MS,
  };
}

class SertifikasiKpiService {
  /**
   * Hitung agregasi KPI sertifikasi nasional.
   * Data di-cache dalam memori dengan TTL per tahun agar tidak query ulang ke
   * multi-db setiap kali di-refresh.
   *
   * @param {string|null} year - Tahun filter (atau null/'all' untuk all-time).
   * @returns {Promise<Object>} {
   *   total_nasional,
   *   pasca_panen: { total, items: { SKP, HACCP, SPDI } },
   *   primer: { total, items: { CPIB, CBIB, CPPIB, CPOIB, CDOIB, CPIB_KAPAL } },
   *   updated_at
   * }
   */
  async getKpiNasional(year = null) {
    const key = cacheKey(year);

    if (isCacheValid(key)) {
      return cache[key].data;
    }

    // Jalankan semua query COUNT secara parallel
    const [skp, haccp, spdi, primerItems, cpibKapal] = await Promise.all([
      SertifikasiKpiRepository.countSkp(year),
      SertifikasiKpiRepository.countHaccp(year),
      SertifikasiKpiRepository.countSpdi(year),
      SertifikasiKpiRepository.countPrimerByIzin(year),
      SertifikasiKpiRepository.countKapal(year),
    ]);

    const pascaPanenTotal = skp + haccp + spdi;
    const primerTotal =
      primerItems.CPIB +
      primerItems.CBIB +
      primerItems.CPPIB +
      primerItems.CPOIB +
      primerItems.CDOIB +
      cpibKapal;

    const totalNasional = pascaPanenTotal + primerTotal;

    const result = {
      success: true,
      data: {
        total_nasional: totalNasional,
        pasca_panen: {
          total: pascaPanenTotal,
          items: {
            SKP: skp,
            HACCP: haccp,
            SPDI: spdi,
          },
        },
        primer: {
          total: primerTotal,
          items: {
            CPIB: primerItems.CPIB,
            CBIB: primerItems.CBIB,
            CPPIB: primerItems.CPPIB,
            CPOIB: primerItems.CPOIB,
            CDOIB: primerItems.CDOIB,
            CPIB_KAPAL: cpibKapal,
          },
        },
        selected_year: year || 'all',
        updated_at: new Date().toISOString(),
      },
    };

    setCache(key, result);
    return result;
  }

  /**
   * Clear cache (opsional, untuk admin/refresh manual).
   */
  static clearCache() {
    Object.keys(cache).forEach((key) => delete cache[key]);
  }
}

export default new SertifikasiKpiService();
