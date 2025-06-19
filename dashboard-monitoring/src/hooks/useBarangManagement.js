import { useState, useEffect } from 'react';
import api from '../config/api';

const useBarangManagement = () => {
  const [barangList, setBarangList] = useState([]);
  const [stokRekap, setStokRekap] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch Daftar Barang
  const fetchBarangList = async () => {
    setIsLoading(true);
    try {
      const response = await api.get('/barang');
      setBarangList(response.data);
      setError(null);
    } catch (error) {
      console.error("Gagal mengambil data barang:", error);
      setError(error);
    } finally {
      setIsLoading(false);
    }
  };

  // Tambah Barang Baru
  const tambahBarang = async (barangData) => {
    setIsLoading(true);
    try {
      const response = await api.post('/barang', barangData);
      fetchBarangList(); // Refresh list
      return response.data;
    } catch (error) {
      console.error("Gagal menambah barang:", error);
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Update Barang
  const updateBarang = async (id, barangData) => {
    setIsLoading(true);
    try {
      const response = await api.put(`/barang/${id}`, barangData);
      fetchBarangList(); // Refresh list
      return response.data;
    } catch (error) {
      console.error("Gagal update barang:", error);
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Hapus Barang
  const hapusBarang = async (id) => {
    setIsLoading(true);
    try {
      await api.delete(`/barang/${id}`);
      fetchBarangList(); // Refresh list
    } catch (error) {
      console.error("Gagal hapus barang:", error);
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Rekap Stok Barang
  const fetchStokRekap = async () => {
    setIsLoading(true);
    try {
      const response = await api.get('/barang/rekap');
      setStokRekap(response.data);
    } catch (error) {
      console.error("Gagal mengambil rekap stok:", error);
      setError(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBarangList();
  }, []);

  return {
    barangList,
    stokRekap,
    isLoading,
    error,
    tambahBarang,
    updateBarang,
    hapusBarang,
    fetchStokRekap
  };
};

export default useBarangManagement;