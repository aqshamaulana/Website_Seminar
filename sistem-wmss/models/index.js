'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const sequelize = require('../config/database'); // Pastikan path ini benar
const db = {};

fs
  .readdirSync(__dirname)
  .filter(file => {
    // Cari semua file .js di folder ini, kecuali file index.js itu sendiri
    return (file.indexOf('.') !== 0) && (file !== path.basename(__filename)) && (file.slice(-3) === '.js');
  })
  .forEach(file => {
    // --- PERUBAHAN UTAMA ADA DI SINI ---
    // Kita tidak lagi memanggilnya sebagai fungsi.
    // Kita langsung me-require model Class-nya.
    const model = require(path.join(__dirname, file));
    
    // Pastikan modelnya adalah model Sequelize sebelum menambahkannya ke db
    if (model && model.prototype instanceof Sequelize.Model) {
      db[model.name] = model;
    }
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;