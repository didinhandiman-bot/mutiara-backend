import MitraRequirement from '../models/mitraRequirement.model.js';

class MitraRequirementRepository {
  async findAllOrdered() {
    return MitraRequirement.findAll({
      order: [['order_index', 'ASC']],
    });
  }
}

export default new MitraRequirementRepository();
