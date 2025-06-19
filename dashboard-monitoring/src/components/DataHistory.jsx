import React, { useEffect, useState } from "react";

// Komponen ikon sederhana untuk status
const StatusIcon = ({ status }) => {
  const isMoving = status?.toLowerCase() === "moving";
  return (
    <div className={`w-3 h-3 rounded-full mr-2 ${isMoving ? "bg-green-500" : "bg-red-500"}`}></div>
  );
};

const DataHistory = () => {
  const [history, setHistory] = useState([
    // Data tiruan (mock data) untuk pratinjau desain
    { robot_id: "Cobot-01", status: "Moving", timestamp: "2025-06-19T10:30:00Z" },
    { robot_id: "Cobot-02", status: "Stopped", timestamp: "2025-06-19T10:28:15Z" },
    { robot_id: "Cobot-01", status: "Stopped", timestamp: "2025-06-19T10:25:45Z" },
    { robot_id: "Cobot-03", status: "Moving", timestamp: "2025-06-19T10:22:05Z" },
  ]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      setLoading(true);
      try {
        // Ganti dengan URL Node-RED kamu yang sebenarnya
        const res = await fetch("http://localhost:1880/api/history"); 
        const data = await res.json();
        // Urutkan data berdasarkan waktu terbaru
        const sorted = data.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        setHistory(sorted);
      } catch (err) {
        console.error("Failed to fetch history:", err);
        // Jika fetch gagal, data tiruan akan tetap ditampilkan
      } finally {
        setLoading(false);
      }
    };

    // fetchHistory(); // Aktifkan baris ini saat API sudah siap
    // Untuk sekarang, kita set loading ke false agar bisa lihat data tiruan
    const timer = setTimeout(() => setLoading(false), 500); 
    return () => clearTimeout(timer);
  }, []);

  const formatTime = (timestamp) => {
    if (!timestamp) return "N/A";
    const date = new Date(timestamp);
    return date.toLocaleString('id-ID', {
        dateStyle: 'medium',
        timeStyle: 'short'
    });
  };

  if (loading) {
    return (
        <div className="text-center p-10 bg-slate-800 rounded-lg shadow-md">
            <p className="text-gray-400">Memuat riwayat data...</p>
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

        {/* --- Tampilan Tabel untuk Layar Besar (md dan ke atas) --- */}
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
                        <tr key={item.timestamp + item.robot_id} className="hover:bg-slate-700/50 transition-colors">
                            <td className="py-3 px-4 text-gray-400">{index + 1}</td>
                            <td className="py-3 px-4 font-semibold text-gray-200">{item.robot_id}</td>
                            <td className="py-3 px-4">
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${item.status?.toLowerCase() === "moving" ? "bg-green-900/50 text-green-300" : "bg-red-900/50 text-red-300"}`}>
                                    {item.status}
                                </span>
                            </td>
                            <td className="py-3 px-4 text-sm text-gray-300">{formatTime(item.timestamp)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>

        {/* --- Tampilan Kartu untuk Layar Kecil (di bawah md) --- */}
        <div className="md:hidden p-4 space-y-4">
            {history.map((item) => (
                <div key={item.timestamp + item.robot_id} className="bg-slate-700/50 rounded-lg p-4 shadow">
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
