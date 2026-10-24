import { Op } from 'sequelize';
import mitraRequirementRepository from '../repositories/mitraRequirement.repository.js';
import upiNoregRepository from '../repositories/upiNoreg.repository.js';

class RegistrasiMitraService {
  async getAllMitraRequirements() {
    return mitraRequirementRepository.findAllOrdered();
  }

  async getPaginatedUpiNoreg({ page, limit, search, negara, status }) {
    const currentPage = Math.max(parseInt(page) || 1, 1);
    const currentLimit = Math.max(parseInt(limit) || 10, 1);
    const offset = (currentPage - 1) * currentLimit;

    const whereClause = {};

    if (search) {
      whereClause[Op.or] = [
        { nama_upi: { [Op.like]: `%${search}%` } },
        { nomor_registrasi: { [Op.like]: `%${search}%` } },
      ];
    }

    if (negara && negara !== 'all') {
      whereClause.negara_tujuan = negara;
    }

    if (status && status !== 'all') {
      whereClause.status = status;
    }

    const { count: totalItems, rows: data } =
      await upiNoregRepository.findPaginated({
        whereClause,
        limit: currentLimit,
        offset,
      });

    const totalPages = Math.ceil(totalItems / currentLimit);

    return {
      data,
      pagination: {
        totalItems,
        totalPages,
        currentPage,
        limit: currentLimit,
      },
    };
  }

  async getAvailableCountries() {
    return upiNoregRepository.getDistinctCountries();
  }
}

export default new RegistrasiMitraService();
