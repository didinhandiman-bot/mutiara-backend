import { DataTypes } from 'sequelize';
import sequelize from '../config/sequelize.js';

const MitraRequirement = sequelize.define(
  'MitraRequirement',
  {
    id: {
      type: DataTypes.STRING(50),
      primaryKey: true,
      allowNull: false,
    },
    country: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    flag: {
      type: DataTypes.STRING(10),
      allowNull: true,
    },
    authority: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    full_name_authority: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'full_name_authority',
    },
    requirements: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    pdf_url: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'pdf_url',
    },
    external_portal_url: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'external_portal_url',
    },
    order_index: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
      field: 'order_index',
    },
  },
  {
    tableName: 'mitra_requirements',
    timestamps: true,
  }
);

export default MitraRequirement;
