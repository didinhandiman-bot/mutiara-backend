import UpiNoreg from '../models/upiNoreg.model.js';
import { Op } from 'sequelize';

class UpiNoregRepository {
  async findPaginated({ whereClause, limit, offset }) {
    return UpiNoreg.findAndCountAll({
      where: whereClause,
      limit,
      offset,
      order: [['nama_upi', 'ASC']],
    });
  }

  async getDistinctCountries() {
    const result = await UpiNoreg.findAll({
      attributes: ['negara_tujuan'],
      where: {
        negara_tujuan: {
          [Op.ne]: null,
          [Op.ne]: '',
        },
      },
      group: ['negara_tujuan'],
      raw: true,
    });
    return result.map((row) => row.negara_tujuan).filter(Boolean);
  }
}

export default new UpiNoregRepository();
