const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Package = sequelize.define('Package', {
  code: {
    type: DataTypes.STRING,
    primaryKey: true,
    unique: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  piston_qty: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  valve_qty: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  motor_qty: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  max_boxes: {
    type: DataTypes.INTEGER,
    defaultValue: 0
}
}, {
  tableName: 'packages'  // Nama tabel di database
});

module.exports = Package;