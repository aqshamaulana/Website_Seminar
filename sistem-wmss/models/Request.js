const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // Sesuaikan path jika perlu

const Request = sequelize.define('Request', {

  paket_a: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    allowNull: false
  },
  paket_b: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    allowNull: false
  },
  paket_c: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    allowNull: false
  },
  requested_by: {
    type: DataTypes.STRING,
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('pending', 'processing', 'done'),
    defaultValue: 'pending',
    allowNull: false
  },
}, {
  tableName: 'requests', // pastikan nama tabel sesuai
  timestamps: true,
  underscored: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = Request;