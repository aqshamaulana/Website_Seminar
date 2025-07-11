import { useEffect, useState } from "react";

// Hook sekarang menerima 'endpoint' sebagai argumen (misal: 'ur30', 'urcobot')
const useURData = (endpoint) => {
  const [urData, setUrData] = useState(null);
  const [currentHistory, setCurrentHistory] = useState([]);
  
  const defaultURData = {
    robotId: endpoint.toUpperCase(), // ID default berdasarkan endpoint
    robotStatus: false,
    alarmStatus: "None",
    toolStatus: "N/A",
    jointDegrees: [0, 0, 0, 0, 0, 0],
    runTime: 0,
    cycleCount: 0,
    robotCurrent: 0,
  };

  useEffect(() => {
    // Hentikan jika tidak ada endpoint yang diberikan
    if (!endpoint) return;

    // Buat koneksi WebSocket secara dinamis berdasarkan endpoint
    const ws = new WebSocket(`${process.env.REACT_APP_WEBSOCKET_URL}/${endpoint}`);
    
    ws.onopen = () => {
      console.log(`WebSocket connected to /${endpoint}`);
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        
        // Update data lengkap untuk kartu
        setUrData({
          robotId: endpoint.toUpperCase(),
          ...data
        });

        // Update riwayat untuk grafik (jika ada data robotCurrent)
        if (data.robotCurrent !== undefined) {
          const now = new Date();
          setCurrentHistory(prev => {
            const fiveMinutesAgo = now.getTime() - 5 * 60 * 1000;
            // Filter data lama & tambahkan data baru
            const updatedHistory = [
              ...prev.filter(item => item.timestamp >= fiveMinutesAgo),
              {
                time: now.toLocaleTimeString("id-ID"),
                current: data.robotCurrent,
                timestamp: now.getTime()
              }
            ];
            // Batasi hanya 20 data point terakhir agar tidak terlalu berat
            return updatedHistory.slice(-20);
          });
        }
      } catch (error) {
        console.error(`Failed to parse WebSocket data for /${endpoint}:`, error);
      }
    };
    
    ws.onerror = (error) => {
      console.error(`WebSocket error for /${endpoint}:`, error);
    };

    // Fungsi cleanup untuk menutup koneksi
    return () => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.close();
      }
    };
  }, [endpoint]); // useEffect ini akan berjalan ulang jika endpoint berubah

  return {
    urData: urData || defaultURData,
    currentHistory,
  };
};

export default useURData;