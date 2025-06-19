const db = require('../config/database');

const paketKombinasi = {
  a: { piston: 2, valve: 1, motor: 3 },
  b: { piston: 1, valve: 3 },
  c: { piston: 4, valve: 1, motor: 1 }
};

exports.getTotalPaket = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT paket_a, paket_b, paket_c FROM stok LIMIT 1');
    if (rows.length > 0) {
      res.json(rows[0]);
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
    const [rows] = await db.query('SELECT * FROM stok');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: 'error', message: 'Gagal mengambil data stok.' });
  }
};

exports.getPendingRequest = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM pending_request WHERE status = 'pending'");
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};


exports.requestPaket = async (req, res) => {
  const { a = 0, b = 0, c = 0 } = req.body;
  try {
    await db.query('INSERT INTO pending_request (paket_a, paket_b, paket_c) VALUES (?, ?, ?)', [a, b, c]);
    res.json({ status: 'ok', message: 'Permintaan disimpan. Tunggu sinyal dari Modbus untuk proses.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: 'error', message: 'Gagal menyimpan permintaan.' });
  }
};

exports.tambahStok = async (req, res) => {
  const { nama_barang, jumlah } = req.body;
  if (!nama_barang || isNaN(jumlah)) {
    return res.json({ status: "error", message: "Data tidak valid." });
  }

  try {
    await db.query("UPDATE stok SET jumlah = jumlah + ? WHERE nama_barang = ?", [jumlah, nama_barang]);
    res.json({ status: "ok" });
  } catch (err) {
    console.error(err);
    res.json({ status: "error", message: "Gagal update database." });
  }
};

exports.triggerPengurangan = async (req, res) => {
  try {
    // Ambil satu permintaan paling awal yang masih pending
    const [pendingRows] = await db.query(
      "SELECT * FROM pending_request WHERE status = 'pending' ORDER BY id ASC LIMIT 1"
    );
    if (pendingRows.length === 0) {
      return res.status(404).json({ status: 'no_pending', message: 'Tidak ada permintaan pending.' });
    }
    
    const { id, paket_a, paket_b, paket_c } = pendingRows[0];
    const totalKebutuhan = {};
    
    for (const [paket, jumlah] of Object.entries({ a: paket_a, b: paket_b, c: paket_c })) {
      const isi = paketKombinasi[paket];
      for (const [barang, qty] of Object.entries(isi)) {
        totalKebutuhan[barang] = (totalKebutuhan[barang] || 0) + qty * jumlah;
      }
    }
    
    // Cek stok cukup
    const [stokRows] = await db.query("SELECT nama_barang, jumlah FROM stok");
    const stokMap = {};
    stokRows.forEach(({ nama_barang, jumlah }) => {
      stokMap[nama_barang] = jumlah;
    });
    
    for (const [barang, qty] of Object.entries(totalKebutuhan)) {
      if ((stokMap[barang] || 0) < qty) {
        return res.status(400).json({ status: 'error', message: `Stok ${barang} tidak cukup.` });
      }
    }
    
    // Kurangi stok
    for (const [barang, qty] of Object.entries(totalKebutuhan)) {
      await db.query("UPDATE stok SET jumlah = jumlah - ? WHERE nama_barang = ?", [qty, barang]);
    }
    
    // Tambah jumlah paket
    await db.query(
      `UPDATE stok SET 
        paket_a = paket_a + ?, 
        paket_b = paket_b + ?, 
        paket_c = paket_c + ?
       WHERE id = 1`,
      [paket_a, paket_b, paket_c]
    );
    
    // Tandai permintaan sebagai selesai
    await db.query("UPDATE pending_request SET status = 'done' WHERE id = ?", [id]);
    
    res.json({ status: 'ok', message: 'Pengurangan stok dan update paket berhasil.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: 'error', message: 'Terjadi kesalahan di server.' });
  }
};