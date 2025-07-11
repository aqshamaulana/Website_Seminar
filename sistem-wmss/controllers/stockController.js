const Stock = require('../models/Stock');
const Request = require('../models/Request');
const sequelize = require('../config/database');

console.log('addStok function:', exports.addStok);

exports.getTotalPaket = async (req, res) => {
  try {
    const totalPaket = await Stock.getTotalPaket();
    
    if (totalPaket) {
      res.json(totalPaket);
    } else {
      res.status(404).json({ message: 'Data tidak ditemukan.' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Gagal mengambil data total paket.' });
  }
};

exports.getStok = async (req, res) => {
  try {
    const stokData = await Stock.getStokData();
    res.json(stokData);
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: 'error', message: 'Gagal mengambil data stok.' });
  }
};

exports.requestPaket = async (req, res) => {
  const { a = 0, b = 0, c = 0 } = req.body;
  const t = await sequelize.transaction();

  try {
    // Buat request baru
    const newRequest = await Request.create({
      paket_a: a,
      paket_b: b,
      paket_c: c,
      status: 'pending'
    }, { transaction: t });

    await t.commit();

    res.json({ 
      status: 'ok', 
      message: 'Permintaan disimpan. Tunggu sinyal dari Modbus untuk proses.',
      requestId: newRequest.id 
    });
  } catch (err) {
    await t.rollback();
    console.error(err);
    res.status(500).json({ status: 'error', message: 'Gagal menyimpan permintaan.' });
  }
};

exports.updateStock = async (req, res) => {
  const { paket_a, paket_b, paket_c } = req.body;
  try {
    // Update stok untuk paket_a
    if (paket_a > 0) {
      await Stock.decrement({ jumlah: paket_a }, { where: { nama_barang: 'Photoelectric' } });
    }
    // Update stok untuk paket_b
    if (paket_b > 0) {
      await Stock.decrement({ jumlah: paket_b }, { where: { nama_barang: 'limit switch' } });
    }
    // Update stok untuk paket_c
    if (paket_c > 0) {
      await Stock.decrement({ jumlah: paket_c }, { where: { nama_barang: 'Inductive' } });
    }
    res.status(200).json({ message: 'Stok berhasil diperbarui' });
  } catch (error) {
    console.error("Gagal mengupdate stok:", error);
    res.status(500).json({ error: error.message });
  }
};

// FIXED: Fungsi untuk menambah stok berdasarkan paket
exports.addStok = async (req, res) => {
  const { a = 0, b = 0, c = 0 } = req.body;
  console.log('Data yang diterima untuk stok di backend:', { a, b, c });

  const t = await sequelize.transaction();

  try {
    // Cari atau buat record untuk setiap jenis barang
    const barangTypes = ['Photoelectric', 'limit switch', 'Inductive'];
    
    for (const namaBarang of barangTypes) {
      // Cari stock item berdasarkan nama_barang
      let stockItem = await Stock.findOne({
        where: { nama_barang: namaBarang },
        transaction: t
      });

      // Jika tidak ada, buat entry baru
      if (!stockItem) {
        stockItem = await Stock.create({
          nama_barang: namaBarang,
          jumlah: 0,
          paket_a: 0,
          paket_b: 0,
          paket_c: 0
        }, { transaction: t });
        console.log(`Stock baru dibuat untuk ${namaBarang}`);
      }

      // Hitung penambahan berdasarkan kombinasi paket
      let totalPenambahanJumlah = 0;
      
      // Paket A: piston: 2, valve: 1, motor: 3
      if (a > 0) {
        const multiplier = Stock.paketKombinasi.a[namaBarang] || 0;
        totalPenambahanJumlah += a * multiplier;
        stockItem.paket_a += a;
      }

      // Paket B: piston: 1, valve: 3
      if (b > 0) {
        const multiplier = Stock.paketKombinasi.b[namaBarang] || 0;
        totalPenambahanJumlah += b * multiplier;
        stockItem.paket_b += b;
      }

      // Paket C: piston: 4, valve: 1, motor: 1
      if (c > 0) {
        const multiplier = Stock.paketKombinasi.c[namaBarang] || 0;
        totalPenambahanJumlah += c * multiplier;
        stockItem.paket_c += c;
      }

      // Update jumlah total
      stockItem.jumlah += totalPenambahanJumlah;
      
      // Simpan perubahan
      await stockItem.save({ transaction: t });
      
      console.log(`${namaBarang}: +${totalPenambahanJumlah} unit, paket_a: +${a}, paket_b: +${b}, paket_c: +${c}`);
      console.log(`Total ${namaBarang} sekarang: ${stockItem.jumlah}`);
    }

    await t.commit();
    console.log('Stok berhasil ditambahkan');
    res.json({ 
      status: 'ok', 
      message: 'Stok berhasil ditambahkan',
      added: { a, b, c }
    });

  } catch (err) {
    await t.rollback();
    console.error('Gagal menambah stok:', err);
    res.status(500).json({ 
      status: 'error', 
      message: 'Gagal menambah stok: ' + err.message 
    });
  }
};

exports.triggerPengurangan = async (req, res) => {
  const t = await sequelize.transaction();

  try {
    // Ambil satu permintaan paling awal yang masih pending
    const pendingRequest = await Request.findOne({
      where: { status: 'pending' },
      order: [['created_at', 'ASC']],
      transaction: t
    });

    if (!pendingRequest) {
      await t.commit();
      return res.status(404).json({ 
        status: 'no_pending', 
        message: 'Tidak ada permintaan pending.' 
      });
    }

    const { paket_a, paket_b, paket_c } = pendingRequest;
    
    // Hitung total kebutuhan komponen
    const totalKebutuhan = {
      'Photoelectric': 0,
      'limit switch': 0,
      'Inductive': 0
    };

    // Paket A: piston: 2, valve: 1, motor: 3
    if (paket_a > 0) {
      totalKebutuhan['Photoelectric'] += paket_a * 2;
      totalKebutuhan['limit switch'] += paket_a * 1;
      totalKebutuhan['Inductive'] += paket_a * 3;
    }

    // Paket B: piston: 1, valve: 3
    if (paket_b > 0) {
      totalKebutuhan['Photoelectric'] += paket_b * 1;
      totalKebutuhan['limit switch'] += paket_b * 3;
    }

    // Paket C: piston: 4, valve: 1, motor: 1
    if (paket_c > 0) {
      totalKebutuhan['Photoelectric'] += paket_c * 4;
      totalKebutuhan['limit switch'] += paket_c * 1;
      totalKebutuhan['Inductive'] += paket_c * 1;
    }

    // Cek stok cukup
    for (const [barang, qty] of Object.entries(totalKebutuhan)) {
      if (qty > 0) {
        const stokItem = await Stock.findOne({
          where: { nama_barang: barang },
          transaction: t
        });
        
        if (!stokItem || stokItem.jumlah < qty) {
          await t.rollback();
          return res.status(400).json({ 
            status: 'error', 
            message: `Stok ${barang} tidak cukup. Dibutuhkan ${qty}, tersedia ${stokItem ? stokItem.jumlah : 0}` 
          });
        }
      }
    }

    // Kurangi stok
    for (const [barang, qty] of Object.entries(totalKebutuhan)) {
      if (qty > 0) {
        await Stock.decrement(
          { jumlah: qty },
          { 
            where: { nama_barang: barang },
            transaction: t
          }
        );
        
        console.log(`${barang}: dikurangi ${qty} unit`);
      }
    }

    // Update total paket keluar - cari record pertama atau yang memiliki total paket
    let stockSummary = await Stock.findOne({ 
      where: { 
        nama_barang: 'piston' // atau bisa gunakan id tertentu
      }, 
      transaction: t 
    });
    
    if (stockSummary) {
      stockSummary.paket_a += paket_a;
      stockSummary.paket_b += paket_b;
      stockSummary.paket_c += paket_c;
      await stockSummary.save({ transaction: t });
      
      console.log(`Total paket keluar - A: +${paket_a}, B: +${paket_b}, C: +${paket_c}`);
    }

    // Tandai permintaan sebagai selesai
    pendingRequest.status = 'completed';
    await pendingRequest.save({ transaction: t });

    await t.commit();

    console.log(`Request #${pendingRequest.id} berhasil diproses`);

    res.json({ 
      status: 'ok', 
      message: 'Pengurangan stok dan update paket berhasil.',
      processedRequest: {
        id: pendingRequest.id,
        paket_a,
        paket_b,
        paket_c,
        requested_by: pendingRequest.requested_by
      }
    });
  } catch (err) {
    await t.rollback();
    console.error('Error in triggerPengurangan:', err);
    res.status(500).json({ 
      status: 'error', 
      message: 'Terjadi kesalahan di server: ' + err.message 
    });
  }
};
