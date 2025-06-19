const Request = require('../models/Request');
const Package = require('../models/Package');

exports.createRequest = async (req, res) => {
  console.log("Body:", req.body);

  try {
    const { a, b, c, requested_by } = req.body;

    const paket_a = a || 0;
    const paket_b = b || 0;
    const paket_c = c || 0;

    // Ambil detail paket dari database
    const [paketA, paketB, paketC] = await Promise.all([
      Package.findOne({ where: { code: 'paket_a' } }),
      Package.findOne({ where: { code: 'paket_b' } }),
      Package.findOne({ where: { code: 'paket_c' } })
    ]);

    // Hitung total kuantitas komponen
    const totalPistonQty = 
      (paketA ? paketA.piston_qty * paket_a : 0) +
      (paketB ? paketB.piston_qty * paket_b : 0) +
      (paketC ? paketC.piston_qty * paket_c : 0);

    const totalValveQty = 
      (paketA ? paketA.valve_qty * paket_a : 0) +
      (paketB ? paketB.valve_qty * paket_b : 0) +
      (paketC ? paketC.valve_qty * paket_c : 0);

    const totalMotorQty = 
      (paketA ? paketA.motor_qty * paket_a : 0) +
      (paketB ? paketB.motor_qty * paket_b : 0) +
      (paketC ? paketC.motor_qty * paket_c : 0);

    // Buat request baru dengan status pending
    const newRequest = await Request.create({
      paket_a,
      paket_b,
      paket_c,
      requested_by,
      total_piston_qty: totalPistonQty,
      total_valve_qty: totalValveQty,
      total_motor_qty: totalMotorQty,
      status: 'pending' // Set sebagai pending, menunggu trigger dari Modbus
    });

    res.status(201).json({
      status: 'ok',
      message: 'Request berhasil dibuat, menunggu proses dari Modbus',
      data: newRequest
    });
  } catch (error) {
    console.error("Error saat membuat request:", error);
    res.status(400).json({ error: error.message });
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