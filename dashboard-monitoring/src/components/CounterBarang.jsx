import React, { useState, useEffect, useRef, useCallback } from 'react';

// Komponen Ikon (WifiOff, Loader2, CheckCircle)
const WifiOff = ({ size = 24, className = '', title = 'Disconnected' }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-label={title}> <title>{title}</title> <line x1="1" y1="1" x2="23" y2="23"></line> <path d="M16.72 11.06A10.94 10.94 0 0 1 19 12.55"></path> <path d="M5 12.55a10.94 10.94 0 0 1 5.17-2.39"></path> <path d="M10.71 5.05A16 16 0 0 1 22.58 9"></path> <path d="M1.42 9a15.91 15.91 0 0 1 4.7-2.88"></path> <path d="M8.53 16.11a6 6 0 0 1 6.95 0"></path> <line x1="12" y1="20" x2="12.01" y2="20"></line> </svg>
);
const Loader2 = ({ size = 24, className = '' }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-label="Loading"> <path d="M21 12a9 9 0 1 1-6.219-8.56"></path> </svg>
);
const CheckCircle = ({ size = 24, className = '' }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}> <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path> <polyline points="22,4 12,14.01 9,11.01"></polyline> </svg>
);

const CounterBarang = ({ darkMode = false }) => {
  const [data, setData] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('connecting'); // 'connecting', 'connected', 'disconnected', 'error'
  const [lastUpdate, setLastUpdate] = useState(null);
  const [messageCount, setMessageCount] = useState(0);
  const socketRef = useRef(null);
  const reconnectTimeoutRef = useRef(null);

  // PERBAIKAN 1: Bungkus fungsi koneksi dalam useCallback
  const connectWebSocket = useCallback(() => {
    console.log("[WebSocket] Attempting to connect...");
    setConnectionStatus('connecting');
    
    try {
      if (socketRef.current) {
        socketRef.current.close();
      }

      // PERBAIKAN 2: Gunakan path '/count' yang benar
      const socket = new WebSocket(`${process.env.REACT_APP_WEBSOCKET_URL}/counting`);
      socketRef.current = socket;

      socket.onopen = () => {
        console.log("[WebSocket] Connection established successfully!");
        setIsConnected(true);
        setConnectionStatus('connected');
        if (reconnectTimeoutRef.current) {
          clearTimeout(reconnectTimeoutRef.current);
          reconnectTimeoutRef.current = null;
        }
      };

      socket.onclose = (event) => {
        console.warn("[WebSocket] Connection closed:", event.code, event.reason);
        setIsConnected(false);
        setConnectionStatus('disconnected');
        
        reconnectTimeoutRef.current = setTimeout(() => {
          console.log("[WebSocket] Attempting to reconnect...");
          connectWebSocket();
        }, 3000);
      };

      socket.onerror = (error) => {
        console.error("[WebSocket] Connection error:", error);
        setIsConnected(false);
        setConnectionStatus('error');
      };

      socket.onmessage = (event) => {
        setConnectionStatus('connected'); // Pastikan status 'connected' jika menerima pesan
        setMessageCount(prev => prev + 1);
        setLastUpdate(new Date().toLocaleTimeString());
        
        try {
          const message = JSON.parse(event.data);
          
          if (message.x !== undefined && message.y !== undefined) {
            const parsedX = parseInt(message.x) || 0;
            const parsedY = parseInt(message.y) || 0;
            setData({ x: parsedX, y: parsedY });
          } else {
            console.warn("[WebSocket] Unknown message format:", message);
          }
        } catch (e) {
          console.error("[WebSocket] JSON parsing error:", e);
        }
      };

    } catch (error) {
      console.error("[WebSocket] Failed to create connection:", error);
      setConnectionStatus('error');
    }
  }, []); // <-- useCallback dependency array kosong karena tidak bergantung pada props atau state

  useEffect(() => {
    connectWebSocket();

    return () => {
      console.log("[WebSocket] Cleaning up connection...");
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (socketRef.current) {
        // Jangan panggil connectWebSocket() di sini untuk menghindari loop
        socketRef.current.onclose = null; // Hapus onclose untuk mencegah reconnect
        socketRef.current.close();
      }
    };
  }, [connectWebSocket]); // <-- PERBAIKAN 1: Tambahkan connectWebSocket ke dependency array

  const getStatusColor = () => {
    switch (connectionStatus) {
      case 'connected': return 'text-green-500';
      case 'connecting': return 'text-yellow-500';
      case 'disconnected': return 'text-red-500';
      case 'error': return 'text-red-600';
      default: return 'text-gray-500';
    }
  };

  const getStatusIcon = () => {
    switch (connectionStatus) {
      case 'connected': return <CheckCircle size={16} className="text-green-500" />;
      case 'connecting': return <Loader2 size={16} className="text-yellow-500 animate-spin" />;
      default: return <WifiOff size={16} className="text-red-500" />;
    }
  };

  const renderContent = () => {
    if (!isConnected && (connectionStatus === 'disconnected' || connectionStatus === 'error')) {
      return (
        <div className="flex flex-col items-center space-y-2">
          <WifiOff size={32} className="text-red-400" />
          <span className="text-sm text-red-400 capitalize">{connectionStatus}</span>
        </div>
      );
    }

    if (data === null) {
      return (
        <div className="flex flex-col items-center space-y-2">
          <Loader2 size={32} className="text-blue-400 animate-spin" />
          <span className="text-sm text-blue-400">Waiting for data...</span>
        </div>
      );
    }

    return (
      <div className="flex flex-col items-center">
        <p className={`text-5xl font-bold ${darkMode ? 'text-gray-100' : 'text-gray-800'} tracking-tight`}>
          <span>{data.x}</span>
          <span className={`text-3xl ${darkMode ? 'text-gray-500' : 'text-gray-400'} mx-2`}>/</span>
          <span>{data.y}</span>
        </p>
        {lastUpdate && (
          <span className="text-xs text-gray-500 mt-1">
            Updated: {lastUpdate}
          </span>
        )}
      </div>
    );
  };

  return (
    <div className={`${darkMode ? 'bg-slate-800 text-gray-200' : 'bg-white'} p-4 rounded-2xl shadow-lg w-full max-w-xs mx-auto transition-colors duration-300`}>
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-base font-semibold">Total Unit Count </h2>
        <div className="flex items-center space-x-2">
          {getStatusIcon()}
          <span className={`text-xs font-medium ${getStatusColor()} capitalize`}>
            {connectionStatus}
          </span>
        </div>
      </div>
      
      <div className={`flex justify-center items-center h-24 ${darkMode ? 'bg-slate-700' : 'bg-gray-100'} rounded-lg`}>
        {renderContent()}
      </div>
      
      <div className="mt-3 text-xs text-gray-500/80 space-y-1 border-t border-gray-200 dark:border-slate-600 pt-2">
        <div>Messages Received: <strong>{messageCount}</strong></div>
        <div>Last Update: <strong>{lastUpdate || 'N/A'}</strong></div>
      </div>
    </div>
  );
};

export default CounterBarang;
