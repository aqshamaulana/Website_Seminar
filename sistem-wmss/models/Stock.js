const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Stock = sequelize.define('Stock', {
  nama_barang: {
    type: DataTypes.STRING,
    allowNull: false
  },
  jumlah: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  paket_a: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  paket_b: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  paket_c: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  }
}, {
  tableName: 'stok',
  timestamps: false
});

// Static method untuk operasi khusus
Stock.paketKombinasi = {
  a: { piston: 2, valve: 1, motor: 3 },
  b: { piston: 1, valve: 3 },
  c: { piston: 4, valve: 1, motor: 1 }
};

Stock.getTotalPaket = async () => {
  try {
    const stock = await Stock.findOne({
      attributes: ['paket_a', 'paket_b', 'paket_c']
    });
    return stock ? stock.toJSON() : null;
  } catch (err) {
    throw err;
  }
};

Stock.getStokData = async () => {
  try {
    return await Stock.findAll();
  } catch (err) {
    throw err;
  }
};

module.exports = Stock;