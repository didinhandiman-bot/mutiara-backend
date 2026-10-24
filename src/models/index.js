import sequelize from '../config/sequelize.js';
import MitraRequirement from './mitraRequirement.model.js';
import UpiNoreg from './upiNoreg.model.js';

const db = {
  sequelize,
  MitraRequirement,
  UpiNoreg,
};

export default db;
