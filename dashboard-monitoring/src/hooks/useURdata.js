// hooks/useURData.js
import { useEffect, useState } from "react";

const useURData = () => {
  const [urData, setUrData] = useState(null);
  const [kukaData] = useState(null);
  const [currentHistory, setCurrentHistory] = useState([]);
  
  const defaultURData = {
    robotId: "UR30",
    robotStatus: false,
    alarmStatus: "None",
    toolStatus: "N/A",
    jointDegrees: [0, 0, 0, 0, 0, 0],
    runTime: 0,
    cycleCount: 0,
    robotCurrent: 0, // Added robotCurrent to default data
  };
  
  const defaultKukaData = {
    robotId: "KUKA",
    robotStatus: false,
    alarmStatus: "None",
    toolStatus: "N/A",
    jointDegrees: [0, 0, 0, 0, 0, 0],
    runTime: 0,
    cycleCount: 0,
  };

  useEffect(() => {
    // WebSocket untuk UR Robot data (untuk current history)
    const urSocket = new WebSocket("ws://localhost:1880/ur");
    
    urSocket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        
        // Update current history
        const now = Date.now();
        setCurrentHistory((prev) => {
          const fiveMinutesAgo = now - 5 * 60 * 1000;
          const filtered = prev.filter(item => item.timestamp >= fiveMinutesAgo);
          
          if (
            filtered.length === 0 ||
            now - filtered[filtered.length - 1].timestamp >= 15 * 1000
          ) {
            const timeLabel = new Date().toLocaleTimeString("id-ID", {
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit"
            });
            
            return [
              ...filtered,
              {
                time: timeLabel,
                current: data.robotCurrent,
                timestamp: now
              }
            ];
          }
          return filtered;
        });
      } catch (error) {
        console.error("Failed to parse WebSocket data for UR:", error);
      }
    };
    
    urSocket.onerror = (error) => {
      console.error("WebSocket error for UR:", error);
    };

    // WebSocket untuk status robot UR (untuk status lengkap)
    const statusSocket = new WebSocket("ws://localhost:1880/urcobot");
    
    statusSocket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        
        // Update urData dengan data lengkap dari WebSocket status
        setUrData({
          robotId: "UR5e", // Keep default robotId
          robotStatus: data.robotStatus || false,
          alarmStatus: data.alarmStatus || "None",
          toolStatus: data.toolStatus || "N/A",
          jointDegrees: data.jointDegrees || [0, 0, 0, 0, 0, 0],
          runTime: data.runTime || 0,
          cycleCount: data.cycleCount || 0,
          robotCurrent: data.robotCurrent || 0, // Include current data
        });
      } catch (error) {
        console.error("Failed to parse WebSocket data for UR status:", error);
      }
    };
    
    statusSocket.onerror = (error) => {
      console.error("WebSocket error for UR status:", error);
    };

    // Cleanup function
    return () => {
      urSocket.close();
      statusSocket.close();
    };
  }, []);

  return {
    urData: urData || defaultURData,
    kukaData: kukaData || defaultKukaData,
    currentHistory,
  };
};

export default useURData;