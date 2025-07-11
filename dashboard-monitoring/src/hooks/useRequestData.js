// src/hooks/useRequestData.js (Versi Final yang Benar)

import { useState, useEffect, useCallback } from 'react';
import api from '../config/api';

const useRequestData = () => {
  const [requestList, setRequestList] = useState([]);
  const [stokData, setStokData] = useState([]);
  const [totalPaket, setTotalPaket] = useState({ paket_a: 0, paket_b: 0, paket_c: 0 });
  const [pendingList, setPendingList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const packageComposition = { 
    a: { photoelectric: 2, 'limit switch': 1, inductive: 3 }, 
    b: { photoelectric: 1, 'limit switch': 3, inductive: 0 }, 
    c: { photoelectric: 4, 'limit switch': 1, inductive: 1 }
  };

  // NAMA FUNGSI KEMBALI SEPERTI SEMULA: fetchData
  // Tugasnya sekarang hanya mengambil data terkait request
  const fetchData = useCallback(async () => {
    try {
      const [requestsRes, pendingRes] = await Promise.all([
        api.get('/api/request'),
        api.get('/api/request/pending')
      ]);
      const mappedRequests = requestsRes.data.map(req => ({
        ...req,
        status: req.status === 'done' ? 'completed' : req.status
      }));
      setRequestList(mappedRequests);
      setPendingList(pendingRes.data);
    } catch (error) {
      console.error("Gagal mengambil data request:", error);
    }
  }, []);

  // Fungsi HANYA untuk mengambil data stok
  const fetchStok = useCallback(async () => {
    try {
      const stokRes = await api.get('/api/stok');
      setStokData(stokRes.data);
    } catch (error) {
      console.error("Gagal mengambil data stok:", error);
    }
  }, []);

  // Efek untuk mengambil data awal
  useEffect(() => {
    const initialLoad = async () => {
        setIsLoading(true);
        await Promise.all([fetchData(), fetchStok()]);
        setIsLoading(false);
    }
    initialLoad();

    // Interval hanya untuk me-refresh daftar request
    const requestInterval = setInterval(fetchData, 5000);

    return () => {
      clearInterval(requestInterval);
    };
  }, [fetchData, fetchStok]);

  // Efek HANYA untuk menghitung total paket keluar saat requestList berubah
  useEffect(() => {
    const completedRequests = requestList.filter(req => req.status === 'completed');
    
    const totals = completedRequests.reduce((acc, req) => {
      acc.paket_a += req.paket_a || 0;
      acc.paket_b += req.paket_b || 0;
      acc.paket_c += req.paket_c || 0;
      return acc;
    }, { paket_a: 0, paket_b: 0, paket_c: 0 });

    setTotalPaket(totals);
  }, [requestList]);

  // Fungsi untuk membuat request baru
  const createRequest = async (requestData) => {
    const payload = {
      a: requestData.paket_a || 0,
      b: requestData.paket_b || 0,
      c: requestData.paket_c || 0,
      requested_by: requestData.requested_by
    };
    const response = await api.post('/api/request', payload);
    
    // Panggil fetchData untuk refresh daftar request
    await fetchData(); 
    return response.data;
  };
  
  const calculatePackageStock = (packageType) => {
    if (!stokData || stokData.length === 0) return 0;
    const composition = packageComposition[packageType];
    if (!composition) return 0;
    let minPackages = Infinity;
    Object.entries(composition).forEach(([component, needed]) => {
      if (needed > 0) {
        const stockItem = stokData.find(item => item.nama_barang && item.nama_barang.toLowerCase() === component.toLowerCase());
        if (stockItem && stockItem.jumlah !== undefined) {
          minPackages = Math.min(minPackages, Math.floor(stockItem.jumlah / needed));
        } else {
          minPackages = 0;
        }
      }
    });
    return minPackages === Infinity ? 0 : minPackages;
  };

  return {
    requestList,
    stokData,
    totalPaket,
    pendingList,
    isLoading,
    createRequest,
    fetchStok,       // <-- Diekspor untuk dipakai di tombol 'Add Stock'
    calculatePackageStock,
    packageComposition,
    fetchData        // <-- Diekspor untuk di-trigger dari luar jika perlu
  };
};

export default useRequestData;