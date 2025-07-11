import React, { useEffect, useState } from "react";

const DataHistory = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // --- EFEK 1: Mengambil data awal saat komponen dimuat ---
  useEffect(() => {
    const fetchHistory = async () => {
      setLoading(true);
      setError(null);
      try {
        // Pastikan alur "Get-From-DB" di Node-RED Anda aktif pada path ini
        const res = await fetch(`${process.env.REACT_APP_NODERED_API_URL}/api/history`); 
        if (!res.ok) {
          throw new Error(`Gagal mengambil data: ${res.statusText}`);
        }
        const data = await res.json();
        setHistory(data); // Data dari DB sudah diurutkan oleh query, jadi tidak perlu di-sort lagi
      } catch (err) {
        console.error("Gagal mengambil riwayat data:", err);
        setError("Gagal memuat riwayat data. Pastikan Node-RED berjalan.");
      } finally {
        setLoading(false);
      }
    };

    fetchHistory(); // Langsung panggil fungsi fetch
  }, []); // Dependensi kosong agar hanya berjalan sekali saat komponen pertama kali dimuat

  // --- EFEK 2: Mendengarkan update real-time via WebSocket ---
  useEffect(() => {
    // Pastikan path ini sesuai dengan websocket out di alur Node-RED Anda
    const ws = new WebSocket(`${process.env.REACT_APP_WEBSOCKET_URL}/ws/history-updates`);

    ws.onopen = () => {
      console.log("History update WebSocket terhubung.");
    };

    ws.onmessage = (event) => {
      try {
        // Node-RED akan menyiarkan data yang BARU saja berhasil disimpan ke DB
        const newHistoryItem = JSON.parse(event.data);

        // Pastikan data valid sebelum ditambahkan
        if (newHistoryItem && newHistoryItem.id) {
            console.log("Menerima riwayat baru secara real-time:", newHistoryItem);
            // Tambahkan data baru ke paling ATAS dari array riwayat yang sudah ada
            setHistory(prevHistory => [newHistoryItem, ...prevHistory]);
        }
      } catch (err) {
        console.error("Gagal memproses update riwayat:", err);
      }
    };

    ws.onerror = (err) => {
      console.error("History update WebSocket error:", err);
    };

    // Cleanup: tutup koneksi saat komponen tidak lagi ditampilkan
    return () => {
      if (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING) {
        ws.close();
      }
    };
  }, []); // Dependensi kosong, hanya berjalan sekali

  const formatTime = (timestamp) => {
    if (!timestamp) return "N/A";
    const date = new Date(timestamp);
    return date.toLocaleString('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="text-center p-10 bg-slate-800 rounded-lg shadow-md">
        <p className="text-gray-400">Memuat riwayat data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-10 bg-slate-800 rounded-lg shadow-md">
        <p className="text-red-400">{error}</p>
      </div>
    );
  }

  if (history.length === 0) {
    return (
      <div className="text-center p-10 bg-slate-800 rounded-lg shadow-md">
        <p className="text-gray-500">Belum ada data riwayat.</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto bg-slate-800 rounded-xl shadow-lg overflow-hidden">
      <h2 className="text-xl font-bold p-4 text-gray-200 border-b border-slate-700">
        Riwayat Aktivitas Robot
      </h2>
      <div className="hidden md:block">
        <table className="min-w-full text-left">
          <thead className="bg-slate-700/50">
            <tr>
              <th className="py-3 px-4 text-sm font-semibold text-gray-400">#</th>
              <th className="py-3 px-4 text-sm font-semibold text-gray-400">Robot ID</th>
              <th className="py-3 px-4 text-sm font-semibold text-gray-400">Status</th>
              <th className="py-3 px-4 text-sm font-semibold text-gray-400">Waktu</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700">
            {history.map((item, index) => (
              <tr key={item.id} className="hover:bg-slate-700/50 transition-colors">
                <td className="py-3 px-4 text-gray-400">{index + 1}</td>
                <td className="py-3 px-4 font-semibold text-gray-200">{item.robot_id}</td>
                <td className="py-3 px-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${item.status?.toLowerCase() === "Finish Task" ? "bg-green-900/50 text-green-300" : "bg-red-900/50 text-red-300"}`}>
                    {item.status}
                  </span>
                </td>
                <td className="py-3 px-4 text-sm text-gray-300">{formatTime(item.timestamp)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Tampilan mobile */}
      <div className="md:hidden p-4 space-y-4">
        {history.map((item) => (
          <div key={item.id} className="bg-slate-700/50 rounded-lg p-4 shadow">
            <div className="flex justify-between items-center mb-3">
              <span className="font-bold text-lg text-gray-100">{item.robot_id}</span>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${item.status?.toLowerCase() === "moving" ? "bg-green-900/50 text-green-300" : "bg-red-900/50 text-red-300"}`}>
                {item.status}
              </span>
            </div>
            <div className="text-sm text-gray-400">
              {formatTime(item.timestamp)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DataHistory;