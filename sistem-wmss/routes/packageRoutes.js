const express = require('express');
const router = express.Router();
const packageController = require('../controllers/packageController');

// Endpoint untuk total paket keluar
router.get('/total-paket', packageController.getTotalPaket);

// Ambil data stok
router.get('/stok', packageController.getStok);

// Ambil data request yang belum diproses
router.get('/pending-request', packageController.getPendingRequest);

// Simpen request paket
router.post('/request-paket', packageController.requestPaket);

// Tambah stok barang
router.post('/tambah-stok', packageController.tambahStok);

// Trigger pengurangan stok
router.post('/trigger-pengurangan', packageController.triggerPengurangan);

module.exports = router;