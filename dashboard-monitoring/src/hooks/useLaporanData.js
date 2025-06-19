// components/useLaporanData.js
import { useState, useEffect } from 'react';
import api from '../config/api';

const useLaporanData = () => {
  const [laporanStok, setLaporanStok] = useState(null);
  const [laporanRequest, setLaporanRequest] = useState(null);
  const [laporanTransaksi, setLaporanTransaksi] = useState(null);
  const [grafikData, setGrafikData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchLaporan = async (filter = {}) => {
    setIsLoading(true);
    try {
      const [stokRes, requestRes, transaksiRes, grafikRes] = await Promise.all([
        api.get('/laporan/stok', { params: filter }),
        api.get('/laporan/request', { params: filter }),
        api.get('/laporan/transaksi', { params: filter }),
        api.get('/laporan/grafik')
      ]);

      setLaporanStok(stokRes.data);
      setLaporanRequest(requestRes.data);
      setLaporanTransaksi(transaksiRes.data);
      setGrafikData(grafikRes.data);
    } catch (error) {
      console.error('Gagal mengambil laporan', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLaporan();
  }, []);

  return {
    laporanStok,
    laporanRequest,
    laporanTransaksi,
    grafikData,
    isLoading,
    fetchLaporan
  };
};

export default useLaporanData;