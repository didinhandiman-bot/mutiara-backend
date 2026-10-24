import { DataTypes } from 'sequelize';
import sequelize from '../config/sequelize.js';

const UpiNoreg = sequelize.define(
  'UpiNoreg',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    nama_upi: {
      type: DataTypes.STRING(255),
      allowNull: false,
      field: 'nama_upi',
    },
    jenis_fasilitas: {
      type: DataTypes.STRING(150),
      allowNull: true,
      field: 'jenis_fasilitas',
    },
    negara_tujuan: {
      type: DataTypes.STRING(100),
      allowNull: true,
      field: 'negara_tujuan',
    },
    nomor_registrasi: {
      type: DataTypes.STRING(100),
      allowNull: true,
      field: 'nomor_registrasi',
    },
    status: {
      type: DataTypes.ENUM('Aktif', 'Perpanjangan', 'Pending', 'Nonaktif'),
      allowNull: true,
    },
    tgl_terbit: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      field: 'tgl_terbit',
    },
    tgl_kedaluwarsa: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      field: 'tgl_kedaluwarsa',
    },
  },
  {
    tableName: 'upi_noreg',
    timestamps: true,
    underscored: true,
  }
);

export default UpiNoreg;
