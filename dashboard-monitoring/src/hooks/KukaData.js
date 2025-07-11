// KukaData.jsx
import { useEffect, useState, useCallback } from "react";

const useKukaLiveData = (buttonType = "amr1", ledType = "led1", pageType = "user") => {
  const [robots, setRobots] = useState([]);
  const [amrSocket, setAmrSocket] = useState(null);
  const [indicatorStatus, setIndicatorStatus] = useState({ led1: "OFF", led2: "OFF" });
  const [isRunning, setIsRunning] = useState(false);

  const [historySocket, setHistorySocket] = useState(null);

  // Mendapatkan data robot
  useEffect(() => {
    const socket = new WebSocket(`${process.env.REACT_APP_WEBSOCKET_URL}/ws/kuka`);

    socket.onopen = () => {
      console.log("Koneksi WebSocket data robot dibuka");
    };

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        const sorted = [...(Array.isArray(data) ? data : [data])].sort((a, b) =>
          a.robotId.localeCompare(b.robotId)
        );
        setRobots(sorted);
      } catch (err) {
        console.error("Gagal mengurai data WebSocket:", err);
      }
    };

    socket.onerror = (error) => {
      console.error("Error pada WebSocket data robot:", error);
    };

    return () => {
      if (socket.readyState === WebSocket.OPEN) {
        socket.close();
      }
    };
  }, []);

  // WebSocket untuk tombol dengan topik yang sesuai
  useEffect(() => {
    // Menggunakan endpoint WebSocket yang benar berdasarkan buttonType
    const wsEndpoint = buttonType === "amr1" ? `${process.env.REACT_APP_WEBSOCKET_URL}/buttonamr1` : `${process.env.REACT_APP_WEBSOCKET_URL}/buttonamr2`;
    const socket = new WebSocket(wsEndpoint);
    
    // Mengatur topik pesan sesuai dengan endpoint WebSocket
    socket._topic = buttonType === "amr1" ? "buttonamr1" : "buttonamr2";
    
    setAmrSocket(socket);

    socket.onopen = () => {
      console.log(`WebSocket tombol ${buttonType} terhubung pada halaman ${pageType}`);
    };

    socket.onerror = (error) => {
      console.error(`WebSocket ${buttonType} error pada halaman ${pageType}:`, error);
    };

    return () => {
      if (socket.readyState === WebSocket.OPEN) {
        socket.close();
      }
    };
  }, [buttonType, pageType]);

  // WebSocket untuk LED
  useEffect(() => {
    const ledSocket = new WebSocket(`${process.env.REACT_APP_WEBSOCKET_URL}/led`);
  
    ledSocket.onopen = () => {
      console.log(`WebSocket LED terhubung pada halaman ${pageType}`);
    };
  
    ledSocket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        setIndicatorStatus(prev => ({
          ...prev,
          ...(data.led1 !== undefined && { led1: data.led1 === 1 ? "ON" : "OFF" }),
          ...(data.led2 !== undefined && { led2: data.led2 === 1 ? "ON" : "OFF" }),
        }));
      } catch (err) {
        console.error("Error parsing LED WebSocket message:", err);
      }
    };
  
    return () => {
      if (ledSocket.readyState === WebSocket.OPEN) ledSocket.close();
    };
  }, [pageType]);  

  const sendCommand = useCallback (async (robotId, command) => {
    try {
      const response = await fetch(`http://localhost:5000/api/robot/${robotId}/${command}`, {
        method: "POST",
      });
      const result = await response.json();
      console.log("Hasil perintah:", result);
    } catch (error) {
      console.error("Gagal mengirim perintah:", error);
    }
  }, []);

  useEffect(() => {
    const socket = new WebSocket(`${process.env.REACT_APP_WEBSOCKET_URL}/ws/history`);

    socket.onopen = () => {
      console.log("History WebSocket connected");
      setHistorySocket(socket); // Simpan instance socket ke state
    };

    socket.onclose = () => {
      console.log("History WebSocket disconnected");
      setHistorySocket(null); // Hapus instance saat koneksi tertutup
    };

    socket.onerror = (error) => {
      console.error("History WebSocket Error:", error);
    };

    // Cleanup saat komponen di-unmount
    return () => {
      if (socket.readyState === WebSocket.OPEN) {
        socket.close();
      }
    };
  }, []);

  const runAllRobots = useCallback(async () => {

    const targetRobotIndex = buttonType === "amr1" ? 0 : 1;
    const targetRobot = robots[targetRobotIndex];

    if (amrSocket && amrSocket.readyState === WebSocket.OPEN && targetRobot) {
      setIsRunning(true);

      try {
        amrSocket.send("1");
        console.log(`Pemicu AMR ${buttonType} dikirim dari halaman ${pageType}`);

        await new Promise((resolve) => setTimeout(resolve, 500));

        for (const robot of robots) {
          // Kirim perintah start ke robot (tetap sama)
          await sendCommand(robot.robotId, "start");

          // ---- BAGIAN YANG DIGANTI ----
          // Kirim riwayat menggunakan WebSocket, bukan fetch
          if (historySocket && historySocket.readyState === WebSocket.OPEN) {
            const historyData = {
              robot_id: robot.robotId,
              status: "moving",
              timestamp: new Date().toISOString()
            };
            historySocket.send(JSON.stringify(historyData));
          } else {
            console.error("History WebSocket tidak siap, riwayat untuk robot " + robot.robotId + " tidak terkirim.");
          }
          // ---- AKHIR BAGIAN YANG DIGANTI ----
        }

        console.log("Semua robot dimulai dan riwayat dikirim melalui WebSocket");
      } catch (error) {
        console.error("Error saat menjalankan robot:", error);
      } finally {
        setIsRunning(false);
      }
     } else {
      // Pesan error jika ada yang belum siap
      if (!targetRobot) {
        console.warn("Robot target tidak ditemukan.");
      } else {
        console.warn("WebSocket pemicu AMR belum siap.");
      }
    }
  }, [amrSocket, robots, historySocket, buttonType, pageType, sendCommand]);
  
  return {
    robots,
    indicatorStatus,
    runAllRobots,
    isRunning,
  };
};

export default useKukaLiveData;