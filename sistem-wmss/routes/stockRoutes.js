const express = require('express');
const router = express.Router();
const stockController = require('../controllers/stockController');

// Endpoint untuk total paket keluar
router.get('/total-paket', stockController.getTotalPaket);
 
// Ambil data stok
router.get('/stok', stockController.getStok);

// Simpen request paket (biar ga langsung dikurangin)
router.post('/request-paket', stockController.requestPaket);

// Buat pengurangan stok
// Endpoint dipanggil dari Node-RED saat address 11 = 1
router.post('/trigger-pengurangan', stockController.triggerPengurangan);

// Alternative route jika ada yang masih menggunakan path lama
router.post('/addStok', stockController.addStok);

router.put('/update-stok', stockController.updateStock);

module.exports = router;