import React, { useState } from 'react';
import useBarangManagement from '../hooks/useBarangManagement';
import useLaporanData from '../hooks/useLaporanData';
import { 
    Trash2, 
    Edit, 
    FileText, 
    BarChart2, 
    List
  } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const AdminPage = () => {
  const [activeTab, setActiveTab] = useState('manajemen');
  const { 
    barangList, 
    tambahBarang, 
    updateBarang, 
    hapusBarang,
  } = useBarangManagement();

  const { 
    laporanStok, 
    laporanRequest, 
    grafikData
  } = useLaporanData();

  // State untuk form
  const [formData, setFormData] = useState({
    nama_barang: '',
    jumlah: '',
    satuan: ''
  });
  const [editingId, setEditingId] = useState(null);

  // Handler untuk input form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handler submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        // Update barang
        await updateBarang(editingId, formData);
        setEditingId(null);
      } else {
        // Tambah barang baru
        await tambahBarang(formData);
      }
      
      // Reset form
      setFormData({
        nama_barang: '',
        jumlah: '',
        satuan: ''
      });
    } catch (error) {
      alert('Gagal menyimpan barang');
    }
  };

  // Handler edit barang
  const handleEdit = (barang) => {
    setEditingId(barang.id);
    setFormData({
      nama_barang: barang.nama_barang,
      jumlah: barang.jumlah,
      satuan: barang.satuan
    });
  };

  return (
    <div className="min-h-screen bg-dark-primary text-dark-primary">
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6">Halaman Admin</h1>
    
        {/* Tab Navigation */}
        <div className="flex mb-6">
          <button
            className={`px-4 py-2 mr-2 rounded-lg ${
              activeTab === 'manajemen' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
            onClick={() => setActiveTab('manajemen')}
          >
            Manajemen Stok
          </button>
          <button
            className={`px-4 py-2 rounded-lg ${
              activeTab === 'laporan' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
            onClick={() => setActiveTab('laporan')}
          >
            Laporan
          </button>
        </div>
    
        {/* Manajemen Stok Tab */}
        {activeTab === 'manajemen' && (
          <div className="grid md:grid-cols-2 gap-6">
            {/* Manajemen Stok Barang */}
            <div className="bg-gray-800 shadow-md rounded-lg p-6">
              <h2 className="text-2xl font-semibold mb-4">Manajemen Stok Barang</h2>
              
              {/* Form Tambah/Edit Barang */}
              <form onSubmit={handleSubmit} className="mb-6">
                <div className="mb-4">
                  <input
                    type="text"
                    name="nama_barang"
                    value={formData.nama_barang}
                    onChange={handleInputChange}
                    placeholder="Nama Barang"
                    required
                    className="w-full px-4 py-2 bg-gray-700 border-none rounded-lg text-white focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="mb-4">
                  <input
                    type="number"
                    name="jumlah"
                    value={formData.jumlah}
                    onChange={handleInputChange}
                    placeholder="Jumlah"
                    required
                    className="w-full px-4 py-2 bg-gray-700 border-none rounded-lg text-white focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="mb-4">
                  <input
                    type="text"
                    name="satuan"
                    value={formData.satuan}
                    onChange={handleInputChange}
                    placeholder="Satuan"
                    required
                    className="w-full px-4 py-2 bg-gray-700 border-none rounded-lg text-white focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <button 
                  type="submit" 
                  className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
                >
                  {editingId ? 'Update Barang' : 'Tambah Barang'}
                </button>
              </form>
    
              {/* Tabel Daftar Barang */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-700">
                      <th className="py-2 px-4 text-left">Nama Barang</th>
                      <th className="py-2 px-4 text-left">Jumlah</th>
                      <th className="py-2 px-4 text-left">Satuan</th>
                      <th className="py-2 px-4 text-center">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {barangList.map(barang => (
                      <tr key={barang.id} className="hover:bg-gray-700">
                        <td className="py-2 px-4">{barang.nama_barang}</td>
                        <td className="py-2 px-4">{barang.jumlah}</td>
                        <td className="py-2 px-4">{barang.satuan}</td>
                        <td className="py-2 px-4">
                          <div className="flex space-x-2 justify-center">
                            <button 
                              onClick={() => handleEdit(barang)}
                              className="text-blue-400 hover:text-blue-600"
                            >
                              <Edit size={20} />
                            </button>
                            <button 
                              onClick={() => hapusBarang(barang.id)}
                              className="text-red-400 hover:text-red-600"
                            >
                              <Trash2 size={20} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
    
            {/* Rekap Stok */}
            <div className="bg-gray-800 shadow-md rounded-lg p-6">
              <h2 className="text-2xl font-semibold mb-4">Rekap Stok Barang</h2>
              <div className="space-y-4">
                <div className="bg-blue-900 bg-opacity-30 p-4 rounded-lg">
                  <h3 className="font-semibold text-lg mb-2">Ringkasan Stok</h3>
                  <p>Total Jenis Barang: {barangList.length}</p>
                  <p>Total Stok Keseluruhan: {
                    barangList.reduce((total, barang) => total + barang.jumlah, 0)
                  }</p>
                </div>
    
                <div className="bg-yellow-900 bg-opacity-30 p-4 rounded-lg">
                  <h3 className="font-semibold text-lg mb-2">Barang Stok Rendah</h3>
                  <ul className="space-y-2">
                    {barangList
                      .filter(barang => barang.jumlah < 10)
                      .map(barang => (
                        <li 
                          key={barang.id} 
                          className="flex justify-between bg-gray-700 p-2 rounded"
                        >
                          <span>{barang.nama_barang}</span>
                          <span className="text-red-400">Stok: {barang.jumlah}</span>
                        </li>
                      ))
                    }
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
    
        {/* Laporan Tab */}
        {activeTab === 'laporan' && (
          <div>
            {/* Laporan Stok */}
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div className="bg-gray-800 shadow-md rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-4 flex items-center">
                  <FileText className="mr-2" size={24} />
                  Laporan Stok Barang
                </h2>
                <div className="mb-4">
                  <p>Total Barang: {laporanStok?.total_barang}</p>
                  <p>Total Stok: {laporanStok?.total_stok}</p>
                </div>
                <div className="overflow-x-auto max-h-80 overflow-y-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-700 sticky top-0">
                        <th className="p-2 text-left">Nama Barang</th>
                        <th className="p-2 text-left">Jumlah</th>
                        <th className="p-2 text-left">Satuan</th>
                      </tr>
                    </thead>
                    <tbody>
                      {laporanStok?.barang_list.map(barang => (
                        <tr key={barang.id} className="border-b border-gray-700">
                          <td className="p-2">{barang.nama_barang}</td>
                          <td className="p-2">{barang.jumlah}</td>
                          <td className="p-2">{barang.satuan}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
    
              {/* Laporan Request */}
              <div className="bg-gray-800 shadow-md rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-4 flex items-center">
                  <List className="mr-2" size={24} />
                  Laporan Request Barang
                </h2>
                <div className="mb-4">
                  <p>Total Request: {laporanRequest?.total_request}</p>
                </div>
                <div className="overflow-x-auto max-h-80 overflow-y-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-700 sticky top-0">
                        <th className="p-2 text-left">Nama Barang</th>
                        <th className="p-2 text-left">Jumlah</th>
                        <th className="p-2 text-left">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {laporanRequest?.request_list.map(request => (
                        <tr key={request.id} className="border-b border-gray-700">
                          <td className="p-2">{request.nama_barang}</td>
                          <td className="p-2">{request.jumlah_req}</td>
                          <td className="p-2">
                            <span 
                              className={`
                                p-1 rounded 
                                ${request.status === 'pending' ? 'bg-yellow-600 text-yellow-100' : 
                                  request.status === 'approved' ? 'bg-green-600 text-green-100' : 
                                  'bg-red-600 text-red-100'}
                              `}
                            >
                              {request.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
    
            {/* Grafik Pergerakan */}
            <div className="bg-gray-800 shadow-md rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <BarChart2 className="mr-2" size={24} />
                Grafik Pergerakan Barang
              </h2>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={grafikData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#4B5563" />
                  <XAxis dataKey="nama_barang" tick={{fill: 'white'}} />
                  <YAxis tick={{fill: 'white'}} />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: '#1F2937',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px'
                    }}
                    labelStyle={{color: 'white'}}
                  />
                  <Legend />
                  {grafikData?.map((barang, index) => (
                    <Bar 
                      key={barang.nama_barang} 
                      dataKey={`stok_historis.${index}.jumlah`} 
                      name={barang.nama_barang} 
                      fill={`hsl(${index * 60}, 70%, 50%)`}
                    />
                  ))}
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPage;