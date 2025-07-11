// src/hooks/useFlowStatus.js (Versi Baru yang Fleksibel)

import { useEffect, useState } from "react";

// Tambahkan parameter 'initialDockCount' dengan nilai default 4
export const useFlowStatus = (
  endpoint = "/statusAmr1",
  initialDockCount = 4
) => {
  
  // Buat state awal secara dinamis berdasarkan initialDockCount
  const [status, setStatus] = useState(Array(initialDockCount).fill(0));

  useEffect(() => {
    // Bagian ini tidak perlu diubah, sudah benar
    const url = `${process.env.REACT_APP_WEBSOCKET_URL}${endpoint}`;
    const socket = new WebSocket(url);

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        // Pastikan data yang diterima adalah array sebelum di-set
        if (Array.isArray(data)) {
          setStatus(data);
        }
      } catch (e) {
        console.error(`Error parsing status from ${endpoint}:`, e);
      }
    };

    socket.onerror = (error) => {
      console.error(`WebSocket error on ${endpoint}:`, error);
    };

    return () => socket.close();
  }, [endpoint]); // Dependensi tetap

  return status;
};