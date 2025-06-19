import { useEffect, useState } from "react";

export const useFlowStatus = (
  endpoint = "/statusAmr1",
  backendIP = "localhost:1880",
  prot = "ws"
) => {
  const [status, setStatus] = useState([0, 0, 0, 0]);

  useEffect(() => {
    // Perbaiki path agar tidak double slash
    const url = `${prot}://${backendIP}${endpoint.startsWith("/") ? "" : "/"}${endpoint}`;
    const socket = new WebSocket(url);

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        setStatus(data);
      } catch (e) {
        console.error(`Error parsing status from ${endpoint}:`, e);
      }
    };

    socket.onerror = (error) => {
      console.error(`WebSocket error on ${endpoint}:`, error);
    };

    return () => socket.close();
  }, [backendIP, prot, endpoint]);

  return status;
};
