require('dotenv').config();
const express = require('express');
const cors = require('cors');
const sequelize = require('./config/database');

// Import models untuk sinkronisasi
const Package = require('./models/Package');
const Request = require('./models/Request');
const Stock = require('./models/Stock');

// Import routes
const packageRoutes = require('./routes/packageRoutes');
const requestRoutes = require('./routes/requestRoutes');
const stockRoutes = require('./routes/stockRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/packages', packageRoutes);
app.use('/api/request', requestRoutes);
app.use('/api', stockRoutes);

// Sinkronisasi database
const initializeDatabase = async () => {
  try {
    await sequelize.sync({ alter: true });
    console.log('Database synchronized successfully.');
  } catch (error) {
    console.error('Unable to synchronize database:', error);
  }
};

// Konfigurasi port
const PORT = process.env.PORT || 3001;

// Jalankan server
const startServer = async () => {
  await initializeDatabase();
  
  app.listen(PORT, () => {
    console.log(`Server berjalan di port ${PORT}`);
  });
};

startServer();