const { Request, Stock } = require('../models');
const sequelize = require('../config/database'); 

exports.createRequest = async (req, res) => {
  const { a, b, c, requested_by } = req.body;
  if (!requested_by) {
    return res.status(400).json({ message: 'Nama pengirim harus diisi.' });
  }
  try {
    const newRequest = await Request.create({
      paket_a: a || 0,
      paket_b: b || 0,
      paket_c: c || 0,
      requested_by,
      status: 'pending'
    });
    res.status(201).json({ message: 'Request berhasil dibuat dan masuk antrean.', data: newRequest });
  } catch (error) {
    console.error("Error saat membuat request:", error);
    res.status(500).json({ message: 'Server error saat membuat request.' });
  }
};

exports.processNextRequest = async (req, res) => {
  try {
    const requestToProcess = await Request.findOne({
      where: { status: 'pending' },
      order: [['created_at', 'ASC']]
    });

    if (!requestToProcess) {
      return res.status(404).json({ message: 'Tidak ada antrean pending untuk diproses.' });
    }

    // Ubah status menjadi 'processing'
    requestToProcess.status = 'processing';
    await requestToProcess.save();

    console.log(`Request #${requestToProcess.id} sekarang diproses.`);
    
    // Kirim detail request kembali ke Node-RED
    res.json({ status: 'ok', data: requestToProcess });

  } catch (error) {
    console.error("Error saat memproses request berikutnya:", error);
    res.status(500).json({ message: 'Server error saat memproses request.' });
  }
};

exports.finalizeRequest = async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const requestToFinalize = await Request.findOne({
            where: { status: 'processing' },
            order: [['created_at', 'ASC']],
            transaction: t
        });

        if (!requestToFinalize) {
            await t.commit(); // Tetap commit meski tidak ada apa-apa, agar tidak menggantung
            return res.status(404).json({ message: 'Tidak ada request yang sedang diproses untuk diselesaikan.' });
        }

        const { id, paket_a, paket_b, paket_c } = requestToFinalize;

        // Logika untuk mengurangi stok komponen dan menambah total paket keluar
        const kombinasi = { a: { Photoelectric: 2, 'limit switch': 1, Inductive: 3 }, b: { Photoelectric: 1, 'limit switch': 3, Inductive: 0 }, c: { Photoelectric: 4, 'limit switch': 1, Inductive: 1 } };
        const kebutuhan = { 'Photoelectric': 0, 'limit switch': 0, 'Inductive': 0 };
        
        kebutuhan['Photoelectric'] = (kombinasi.a.Photoelectric * paket_a) + (kombinasi.b.Photoelectric * paket_b) + (kombinasi.c.Photoelectric * paket_c);
        kebutuhan['limit switch'] = (kombinasi.a['limit switch'] * paket_a) + (kombinasi.b['limit switch'] * paket_b) + (kombinasi.c['limit switch'] * paket_c);
        kebutuhan['Inductive'] = (kombinasi.a.Inductive * paket_a) + (kombinasi.b.Inductive * paket_b) + (kombinasi.c.Inductive * paket_c);


        for (const [barang, qty] of Object.entries(kebutuhan)) {
            if (qty > 0) {
                await Stock.decrement('jumlah', { by: qty, where: { nama_barang: barang }, transaction: t });
            }
        }
        
        // Menambah rekap total paket keluar
        // Asumsi rekap disimpan dalam satu baris di tabel stok, misal di item 'piston'
        const stockSummary = await Stock.findOne({ where: { nama_barang: 'piston' }, transaction: t });
        if (stockSummary) {
            await stockSummary.increment({ 'paket_a': paket_a, 'paket_b': paket_b, 'paket_c': paket_c }, { transaction: t });
        }

        // Terakhir, ubah status request menjadi 'done'
        requestToFinalize.status = 'done';
        await requestToFinalize.save({ transaction: t });
        
        await t.commit();
        
        console.log(`Request #${id} berhasil diselesaikan.`);
        res.json({ status: 'ok', message: `Request #${id} selesai, stok telah diperbarui.` });

    } catch (error) {
        await t.rollback();
        console.error("Error saat finalisasi request:", error);
        res.status(500).json({ message: 'Server error saat finalisasi request.' });
    }
};

exports.getAllRequests = async (req, res) => {
  try {
    const requests = await Request.findAll({
      order: [['created_at', 'DESC']],
      raw: true // Tambahkan ini untuk mendapatkan plain object
    });
    
    // Debug log
    console.log('Sample request data:', requests[0]);
    
    res.status(200).json(requests);
  } catch (error) {
    console.error('Error getting requests:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.getPendingRequests = async (req, res) => {
  try {
    const pendingRequests = await Request.findAll({
      where: { status: 'pending' },
      order: [['created_at', 'ASC']],
      raw: true
    });
    
    res.status(200).json(pendingRequests);
  } catch (error) {
    console.error('Error getting pending requests:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.updateRequestStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const request = await Request.findByPk(id);

    if (!request) {
      return res.status(404).json({ message: 'Request tidak ditemukan' });
    }

    request.status = status;
    await request.save();

    res.json({
      message: `Status request berhasil diubah menjadi ${status}`,
      request
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};