import { useState, useEffect } from 'react';
import api from '../config/api';

const useRequestData = () => {
  const [requestList, setRequestList] = useState([]);
  const [stokData, setStokData] = useState([]);
  const [totalPaket, setTotalPaket] = useState({ paket_a: 0, paket_b: 0, paket_c: 0 });
  const [pendingList, setPendingList] = useState([]);
  const [packageList, setPackageList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [requestStatus] = useState(null); // dari WebSocket
  // Definisi komposisi paket
  const packageComposition = {
    'a': { piston: 2, valve: 1, motor: 3 },
    'b': { piston: 1, valve: 3, motor: 0 },
    'c': { piston: 4, valve: 1, motor: 1 }
  };

  // Fungsi untuk menghitung berapa paket yang bisa dibuat berdasarkan stok komponen
  const calculatePackageStock = (packageType) => {
    if (!stokData || stokData.length === 0) return 0;

    const composition = packageComposition[packageType];
    if (!composition) return 0;

    let minPackages = Infinity;

    // Hitung berapa paket yang bisa dibuat berdasarkan stok komponen
    Object.entries(composition).forEach(([component, needed]) => {
      if (needed > 0) {
        const stock = stokData.find(item => 
          item.nama_barang && item.nama_barang.toLowerCase() === component.toLowerCase()
        );

        if (stock && stock.jumlah !== undefined) {
          const possiblePackages = Math.floor(stock.jumlah / needed);
          minPackages = Math.min(minPackages, possiblePackages);
        } else {
          minPackages = 0;
        }
      }
    });

    return minPackages === Infinity ? 0 : minPackages;
  };

  // Fungsi untuk mendapatkan detail stok komponen
  const getComponentStock = (componentName) => {
    const stock = stokData.find(item => 
      item.nama_barang && item.nama_barang.toLowerCase() === componentName.toLowerCase()
    );
    return stock ? stock.jumlah : 0;
  };

  // Fungsi untuk mendapatkan semua stok komponen
  const getAllComponentStocks = () => {
    return {
      piston: getComponentStock('piston'),
      valve: getComponentStock('valve'),
      motor: getComponentStock('motor')
    };
  };

  const fetchRequestList = async () => {
    setIsLoading(true);
    try {
      const response = await api.get('/api/request');
      setRequestList(response.data);
      setError(null);
    } catch (error) {
      console.error("Gagal mengambil data request:", error);
      setError(error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const fetchPackages = async () => {
    try {
      const response = await api.get('/api/packages');
      setPackageList(response.data.packages);
    } catch (error) {
      console.error("Gagal mengambil data paket:", error);
    }
  };

   const fetchStok = async () => {
    try {
      setIsLoading(true);
      const response = await api.get('/api/stok');
      setStokData(response.data);  // Menyimpan data stok yang diterima
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.error('Gagal mengambil data stok:', error);
    }
  };

  const fetchTotalPaket = async () => {
    try {
      const response = await api.get('/api/total-paket');
      setTotalPaket(response.data); // Format: { paket_a: x, paket_b: y, paket_c: z }
    } catch (error) {
      console.error("Gagal mengambil data total paket:", error);
    }
  };

  const fetchPendingList = async () => {
    try {
      const response = await api.get('/api/request/pending');
      setPendingList(response.data);
    } catch (error) {
      console.error("Gagal mengambil pending list:", error);
      // Jika endpoint /pending belum ada, coba filter dari semua request
      try {
        const allRequests = await api.get('/api/request');
        const pending = allRequests.data.filter(req => req.status === 'pending');
        setPendingList(pending);
      } catch (err) {
        console.error("Gagal filter pending list:", err);
      }
    }
  };

  const createRequest = async (requestData) => {
  try {
    // Validasi input dasar
    if (!requestData.requested_by) {
      throw new Error('Nama pengirim harus diisi');
    }

    // Siapkan payload sesuai format backend
    const payload = {
      a: requestData.a || 0,
      b: requestData.b || 0,
      c: requestData.c || 0,
      requested_by: requestData.requested_by || ""
    };

    console.log('SENDING REQUEST DATA:', payload);
    
    // Kirim request ke endpoint baru
    const response = await api.post('/api/request', payload, {
      timeout: 10000 // 10 detik timeout
    });
    
    console.log('FULL API RESPONSE:', response);
    
    // // Update stok setelah request berhasil
    // await updateStock(payload); // Panggil updateStock di sini

    // Refresh data setelah membuat request
    fetchRequestList();
    fetchPendingList();
    fetchStok();
    fetchTotalPaket();
    
    return response.data;
  } catch (error) {
    console.error('FULL API ERROR:', error);
    
    if (error.response && error.response.data.message) {
      throw new Error(error.response.data.message);
    }
    
    throw error;
  }
};

  // Fungsi untuk mengupdate stok
  const updateStock = async (requestData) => {
    const { a, b, c } = requestData;
    try {
      // Kirim request untuk mengupdate stok
      await api.put('/api/update-stok', {
        paket_a: a,
        paket_b: b,
        paket_c: c
      });
    } catch (error) {
      console.error("Gagal mengupdate stok:", error);
      throw error;
    }
  };

    

  const completeRequest = async (id) => {
    try {
      const response = await api.put(`/request/${id}/complete`);
      
      // Refresh list request
      fetchRequestList();
      fetchPendingList();
      fetchStok();
      fetchTotalPaket();
      
      // Tampilkan pesan sukses
      alert(response.data.message);
      
      return response.data;
    } catch (error) {
      console.error('Gagal menyelesaikan request:', error);
      
      // Tampilkan pesan error dari backend
      alert(
        error.response?.data?.message || 
        'Gagal menyelesaikan request'
      );
      
      throw error;
    }
  };

  useEffect(() => {
    // Fetch request list dan packages saat komponen dimuat
    fetchRequestList();
    fetchPackages();
    fetchStok();
    fetchTotalPaket();
    fetchPendingList();
    
    // Interval untuk memperbarui request list dan packages
    const interval = setInterval(() => {
      fetchRequestList();
      fetchPackages();
      fetchStok();
      fetchTotalPaket();
      fetchPendingList();
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);

  // WebSocket untuk status pengiriman ke Cobot
  
  return {
    requestList,
    packageList,
    stokData,
    setTotalPaket,
    totalPaket,
    pendingList,
    isLoading,
    error,
    updateStock,
    createRequest, 
    completeRequest,
    requestStatus,
    calculatePackageStock,      // Tambahkan ini
    getComponentStock,          // Tambahkan ini
    getAllComponentStocks,      // Tambahkan ini
    packageComposition         // Tambahkan ini

  };
};

export default useRequestData;