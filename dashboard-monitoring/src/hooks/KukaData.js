// KukaData.jsx
import { useEffect, useState } from "react";

const useKukaLiveData = (buttonType = "amr1", ledType = "led1", pageType = "user") => {
  const [robots, setRobots] = useState([]);
  const [amrSocket, setAmrSocket] = useState(null);
  const [indicatorStatus, setIndicatorStatus] = useState({ led1: "OFF", led2: "OFF" });
  const [isRunning, setIsRunning] = useState(false);

  // Mendapatkan data robot
  useEffect(() => {
    const socket = new WebSocket("ws://localhost:1880/ws/kuka");

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
    const wsEndpoint = buttonType === "amr1" ? "ws://localhost:1880/buttonamr1" : "ws://localhost:1880/buttonamr2";
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
    const ledSocket = new WebSocket("ws://localhost:1880/led");
  
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


  const sendCommand = async (robotId, command) => {
    try {
      const response = await fetch(`http://localhost:5000/api/robot/${robotId}/${command}`, {
        method: "POST",
      });
      const result = await response.json();
      console.log("Hasil perintah:", result);
    } catch (error) {
      console.error("Gagal mengirim perintah:", error);
    }
  };

  const saveHistory = async (robot_id, status, timestamp) => {
    try {
      await fetch("http://localhost:1880/api/history", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ robot_id, status, timestamp })
      });
      console.log("Riwayat tersimpan");
    } catch (error) {
      console.error("Gagal menyimpan riwayat:", error);
    }
  };

  const runAllRobots = async () => {
    if (amrSocket && amrSocket.readyState === WebSocket.OPEN) {
      setIsRunning(true);
  
      try {
        // Mengirim nilai "1" sebagai payload dengan topik yang benar
        amrSocket.send("1");
        console.log(`Pemicu AMR ${buttonType} dikirim dari halaman ${pageType}`);
      
        await new Promise((resolve) => setTimeout(resolve, 500));
      
        for (const robot of robots) {
          await sendCommand(robot.robotId, "start");
          await saveHistory(robot.robotId, "moving", new Date().toISOString());
        }
      
        console.log("Semua robot dimulai dan riwayat disimpan");
      } catch (error) {
        console.error("Error saat menjalankan robot:", error);
      } finally {
        setIsRunning(false);
      }
    } else {
      console.warn("WebSocket belum siap");
    }
  };
  
  return {
    robots,
    indicatorStatus,
    runAllRobots,
    isRunning,
  };
};

export default useKukaLiveData;