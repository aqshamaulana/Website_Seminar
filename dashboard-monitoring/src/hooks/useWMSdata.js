import { useState, useEffect } from 'react';
import api from '../config/api';

const useWMSData = () => {
  const [StockList, setStockList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchStockList = async () => {
    setIsLoading(true);
    try {
      const response = await api.get('/stok');
      setStockList(response.data);
      setError(null);
    } catch (error) {
      console.error("Gagal mengambil data stok:", error);
      setError(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStockList();
   
    // Refresh data setiap 5 detik
    const interval = setInterval(fetchStockList, 5000);
   
    return () => clearInterval(interval);
  }, []);

  return {
    StockList,
    isLoading,
    error,
    fetchStockList
  };
};

export default useWMSData;
