const laboratoriumRepository = require('../repositories/laboratoriumRepository');

// Konversi nilai koordinat (DECIMAL MySQL dikembalikan sebagai string) ke Number
const toCoordinate = (value) => {
  if (value === null || value === undefined || value === '') return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
};

// Rentang koordinat wilayah Indonesia
// latitude: -11 s/d 6, longitude: 95 s/d 141
const isValidLatitude = (value) => value !== null && value >= -11 && value <= 6;
const isValidLongitude = (value) => value !== null && value >= 95 && value <= 141;

class LaboratoriumService {
  // 1. Data marker peta sebar laboratorium
  async getPetaLaboratorium() {
    const rows = await laboratoriumRepository.getAllMapMarkers();

    const markers = [];
    for (const row of rows) {
      const latitude = toCoordinate(row.latitude);
      const longitude = toCoordinate(row.longitude);

      // Lewati marker yang koordinatnya tidak valid / di luar wilayah Indonesia
      if (!isValidLatitude(latitude) || !isValidLongitude(longitude)) continue;

      markers.push({
        ...row,
        latitude,
        longitude,
        total_parameter: Number(row.total_parameter) || 0
      });
    }

    return markers;
  }

  // 2. Detail laboratorium beserta daftar parameter uji
  async getDetailLaboratorium(kdUnit) {
    const detail = await laboratoriumRepository.getDetailByKdUnit(kdUnit);
    if (!detail) return null;

    const daftarParameter = await laboratoriumRepository.getParametersByKdUnit(kdUnit);

    const latitude = toCoordinate(detail.latitude);
    const longitude = toCoordinate(detail.longitude);

    return {
      ...detail,
      // Koordinat di luar wilayah Indonesia ditandai null agar tidak merusak peta
      latitude: isValidLatitude(latitude) ? latitude : null,
      longitude: isValidLongitude(longitude) ? longitude : null,
      total_parameter: Number(detail.total_parameter) || 0,
      daftar_parameter: daftarParameter
    };
  }
}

module.exports = new LaboratoriumService();
