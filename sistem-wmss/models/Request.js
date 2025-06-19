const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

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
  total_piston_qty: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  total_valve_qty: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  total_motor_qty: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  requested_by: {
    type: DataTypes.STRING,
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('pending', 'completed'),
    defaultValue: 'pending'
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  updated_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'requests',
  timestamps: true,
  underscored: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = Request;
