import React, { useState, useEffect } from "react";
import { 
  Package, 
  Plus, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Box,
  Activity,
  BatteryCharging,
  PlayCircle,
  Send,
  WarehouseIcon,
  X,
  PauseCircle,

} from 'lucide-react';
import { useFlowStatus } from "../hooks/useFlowStatus";
import useKukaLiveData from "../hooks/KukaData";
import useRequestData from "../hooks/useRequestData";
import TrackingCard from "../components/TrackingCard";
import api from "../config/api";
import kukaImg from "../assets/kuka.png";

// Animated Background
const AnimatedBackground = () => (
  <div className="fixed inset-0 -z-10">
    <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-blue-900/20 to-gray-900"></div>
    <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob"></div>
    <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>
    <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-4000"></div>
  </div>
);

// Mini Card Robot Component - menggunakan format yang diminta
const MiniCardRobot = ({ robot, indicatorStatus, ledType, pageType, darkMode = true }) => {
  const isMoving = robot.status?.toLowerCase() === "moving";
  const currentLED = indicatorStatus?.[ledType] || "OFF";
  const statusLEDColor = currentLED === "ON" ? "bg-green-500" : "bg-red-500";
  const statusLEDText = currentLED === "ON" ? "Menyala" : "Mati";
  const batteryLevel = parseInt(robot.batteryLevel) || 0;
  const isAMR1 = robot.robotId === "AMR 1";

  // Battery color based on level
  const getBatteryColor = (level) => {
    if (level > 60) return "text-green-500";
    if (level > 30) return "text-yellow-500";
    return "text-red-500";
  };

  const getBatteryBgColor = (level) => {
    if (level > 60) return "bg-green-500";
    if (level > 30) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <div className="group relative overflow-hidden rounded-2xl shadow-xl transition-all duration-500 hover:shadow-2xl hover:-translate-y-1">
      {/* Background Gradient */}
      <div className={`absolute inset-0 bg-gradient-to-br ${
        isAMR1 
          ? 'from-green-900/90 via-green-800/80 to-green-700/90' 
          : 'from-red-900/90 via-red-800/80 to-red-700/90'
      } opacity-90`}></div>
      
      {/* Content Container */}
      <div className="relative z-10 p-4">
        {/* Header */}
        <div className="text-center mb-3">
          <h3 className="text-xl font-bold text-white">{robot.robotId}</h3>
          <p className="text-xs text-gray-200 opacity-90">{robot.robotType || "AMR"}</p>
        </div>

        {/* Robot Image - Smaller */}
        <div className="relative flex justify-center mb-3">
          <div className={`absolute inset-0 flex items-center justify-center ${isMoving ? 'animate-pulse' : ''}`}>
            <div className={`w-20 h-20 rounded-full ${
              isAMR1 ? 'bg-green-500/20' : 'bg-red-500/20'
            } blur-2xl`}></div>
          </div>
          
          <img 
            src={kukaImg} 
            alt="Robot KUKA" 
            className={`w-20 h-20 object-contain transition-transform duration-700 ${
              isMoving ? 'animate-bounce' : ''
            } group-hover:scale-110`}
          />
        </div>

        {/* LED Indicator */}
        <div className="flex justify-center items-center gap-2 mb-3">
          <div className="relative">
            <div className={`w-6 h-6 rounded-full ${statusLEDColor} shadow-lg`}></div>
            {currentLED === "ON" && (
              <div className={`absolute inset-0 w-6 h-6 rounded-full ${statusLEDColor} animate-ping`}></div>
            )}
          </div>
          <span className="text-xs text-white">{statusLEDText}</span>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-2">
          {/* Status */}
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-2 border border-white/20">
            <div className="flex items-center justify-center gap-1">
              {isMoving ? (
                <PlayCircle className="w-4 h-4 text-green-400" />
              ) : (
                <PauseCircle className="w-4 h-4 text-red-400" />
              )}
              <span className={`text-xs font-bold ${isMoving ? 'text-green-400' : 'text-red-400'}`}>
                {robot.status || "Unknown"}
              </span>
            </div>
          </div>

          {/* Battery */}
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-2 border border-white/20">
            <div className="flex items-center justify-center gap-1">
              <BatteryCharging className={`w-4 h-4 ${getBatteryColor(batteryLevel)}`} />
              <span className={`text-xs font-bold ${getBatteryColor(batteryLevel)}`}>
                {batteryLevel}%
              </span>
            </div>
          </div>

          {/* Runtime */}
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-2 border border-white/20">
            <div className="text-center">
              <Activity className="w-4 h-4 text-blue-400 mx-auto" />
              <span className="text-xs font-bold text-white">
                {Math.round(robot.runTime / 60) || 0}h
              </span>
            </div>
          </div>

          {/* Error */}
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-2 border border-white/20">
            <div className="text-center">
              <AlertCircle className={`w-4 h-4 mx-auto ${robot.errorMessage ? 'text-orange-400' : 'text-gray-400'}`} />
              <span className={`text-xs font-bold ${robot.errorMessage ? 'text-orange-400' : 'text-gray-400'}`}>
                {robot.errorMessage ? 'Error' : 'OK'}
              </span>
            </div>
          </div>
        </div>

        {/* Battery Bar */}
        <div className="mt-2 w-full bg-gray-700 rounded-full h-1.5 overflow-hidden">
          <div 
            className={`h-full transition-all duration-500 ${getBatteryBgColor(batteryLevel)}`}
            style={{ width: `${batteryLevel}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

// Stock Card Component
const StockCard = ({ paket, stock, composition }) => {
  const getStatusColor = (stock) => {
    if (stock > 10) return 'from-emerald-500 to-emerald-600';
    if (stock > 5) return 'from-amber-500 to-amber-600';
    return 'from-rose-500 to-rose-600';
  };

  const getStatusText = (stock) => {
    if (stock > 10) return 'Aman';
    if (stock > 5) return 'Menipis';
    return 'Kosong';
  };

  return (
    <div className="relative group">
      <div className={`absolute -inset-0.5 bg-gradient-to-r ${getStatusColor(stock)} 
        rounded-xl blur opacity-20 group-hover:opacity-30 transition duration-300`}></div>
      
      <div className="relative bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50 
        hover:border-gray-600/50 transition-all duration-300">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-lg font-bold text-white mb-1">Paket {paket.toUpperCase()}</h3>
            <p className="text-xs text-gray-400">
              {composition && Object.entries(composition)
                .filter(([_, qty]) => qty > 0)
                .map(([comp, qty]) => `${comp}: ${qty}`)
                .join(', ')}
            </p>
          </div>
          <div className={`px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r ${getStatusColor(stock)} text-white`}>
            {getStatusText(stock)}
          </div>
        </div>
        
        <div className="flex items-end justify-between">
          <div>
            <p className="text-3xl font-bold text-white">{stock}</p>
            <p className="text-xs text-gray-400 mt-1">Unit tersedia</p>
          </div>
          <Box className="w-8 h-8 text-gray-600" />
        </div>
      </div>
    </div>
  );
};

// Request Item Component
const RequestItem = ({ request, index }) => {
  const statusConfig = {
    pending: {
      color: 'text-amber-400 bg-amber-400/10 border-amber-400/30',
      icon: Clock,
      text: 'Pending'
    },
    completed: {
      color: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/30',
      icon: CheckCircle,
      text: 'Selesai'
    },
    processing: {
      color: 'text-blue-400 bg-blue-400/10 border-blue-400/30',
      icon: Activity,
      text: 'Diproses'
    }
  };

  const config = statusConfig[request.status] || statusConfig.pending;
  const StatusIcon = config.icon;

  return (
    <div 
      className="group bg-gray-800/30 hover:bg-gray-800/50 rounded-xl p-4 
        border border-gray-700/30 hover:border-gray-600/50 transition-all duration-300 cursor-pointer"
      style={{
        animationDelay: `${index * 100}ms`,
        animation: 'slideIn 0.5s ease-out forwards',
        opacity: 0
      }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 
              flex items-center justify-center">
              <span className="text-sm font-bold text-blue-400">#{request.id}</span>
            </div>
            <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-gray-800 
              flex items-center justify-center border border-gray-700">
              <Package className="w-3 h-3 text-gray-400" />
            </div>
          </div>
          
          <div>
            <p className="font-semibold text-white">{request.requested_by}</p>
            <div className="flex items-center gap-3 mt-1">
              {request.paket_a > 0 && (
                <span className="text-xs px-2 py-0.5 bg-emerald-500/10 text-emerald-400 rounded-md">
                  A: {request.paket_a}
                </span>
              )}
              {request.paket_b > 0 && (
                <span className="text-xs px-2 py-0.5 bg-blue-500/10 text-blue-400 rounded-md">
                  B: {request.paket_b}
                </span>
              )}
              {request.paket_c > 0 && (
                <span className="text-xs px-2 py-0.5 bg-purple-500/10 text-purple-400 rounded-md">
                  C: {request.paket_c}
                </span>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-xs text-gray-500">
              {new Date(request.created_at).toLocaleTimeString('id-ID', {
                hour: '2-digit',
                minute: '2-digit'
              })}
            </p>
            <p className="text-xs text-gray-600">
              {new Date(request.created_at).toLocaleDateString('id-ID', {
                day: 'numeric',
                month: 'short'
              })}
            </p>
          </div>
          
          <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold 
            border ${config.color}`}>
            <StatusIcon className="w-3.5 h-3.5" />
            <span>{config.text}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Package Info Card
const PackageInfoCard = ({ paket, composition }) => {
  const icons = {
    'piston': '🔩',
    'valve': '🔧',
    'motor': '⚙️'
  };

  return (
    <div className="bg-gray-800/30 rounded-xl p-6 border border-gray-700/30 hover:border-gray-600/50 
      transition-all duration-300">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-white">Paket {paket}</h3>
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500/20 to-purple-500/20 
          flex items-center justify-center">
          <Package className="w-5 h-5 text-blue-400" />
        </div>
      </div>
      
      <div className="space-y-3">
        {composition && Object.entries(composition).map(([comp, qty]) => qty > 0 && (
          <div key={comp} className="flex items-center justify-between py-2 px-3 bg-gray-900/30 rounded-lg">
            <div className="flex items-center gap-3">
              <span className="text-2xl">{icons[comp]}</span>
              <span className="text-sm text-gray-300 capitalize">{comp}</span>
            </div>
            <span className="text-lg font-semibold text-white">{qty}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// Modal Component
const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>
      
      <div className="relative bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md 
        border border-gray-700 animate-modalSlideIn">
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <h2 className="text-xl font-bold text-white">{title}</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center 
              hover:bg-gray-700 transition-colors"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>
        
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
};

const UserPage = () => {
  const { 
    robots, 
    runAllRobots, 
    isRunning, 
    indicatorStatus 
  } = useKukaLiveData("amr2", "led2", "user");
  
  const { 
    createRequest,
    requestList, 
    fetchStok, 
    totalPaket, 
    pendingList,
    isLoading,
    setTotalPaket,
    calculatePackageStock,      
    packageComposition         
  } = useRequestData();

  const statusAmr1 = useFlowStatus("/statusAmr1");
  const statusAmr2 = useFlowStatus("/statusAmr2");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isStockModalOpen, setIsStockModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('inventory');
  const [, setCurrentTime] = useState(new Date());
  
  const [packageQuantities, setPackageQuantities] = useState({
    'paket_a': 0,
    'paket_b': 0,
    'paket_c': 0
  });
  const [requestedBy, setRequestedBy] = useState("");
  const [error, setError] = useState("");
  const [notification, setNotification] = useState("");
  const [, setRequestStatus] = useState("");

  const [stockToAdd, setStockToAdd] = useState({
    a: 0,
    b: 0,
    c: 0
  });

  // Update time
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleSubmitRequest = async (e) => {
    e.preventDefault();

    const totalQuantity = packageQuantities.paket_a + packageQuantities.paket_b + packageQuantities.paket_c;

    if (totalQuantity === 0) {
      setError("Masukkan kuantitas paket minimal 1");
      return;
    }

    if (!requestedBy.trim()) {
      setError("Nama pengirim harus diisi");
      return;
    }

    const payload = {
      a: packageQuantities.paket_a,
      b: packageQuantities.paket_b,
      c: packageQuantities.paket_c,
      requested_by: requestedBy
    };

    try {
      if (window.ws && window.ws.readyState === WebSocket.OPEN) {
        window.ws.send(JSON.stringify(payload));
      }

      await createRequest(payload);

      setPackageQuantities({ paket_a: 0, paket_b: 0, paket_c: 0 });
      setRequestedBy("");
      setIsModalOpen(false);
      setError("");
      setNotification("✅ Request paket berhasil dikirim");

      setTimeout(() => setNotification(""), 5000);
    } catch (err) {
      setError(err.message || "❌ Gagal mengirim request");
      setNotification("");
    }
  };

  const handleAddStock = async (e) => {
    e.preventDefault();
    
    const totalToAdd = stockToAdd.a + stockToAdd.b + stockToAdd.c;
    if (totalToAdd === 0) {
      setError("Masukkan jumlah stok yang akan ditambahkan");
      return;
    }

    try {
      await api.post('/api/addStok', stockToAdd);
      
      setStockToAdd({ a: 0, b: 0, c: 0 });
      setIsStockModalOpen(false);
      setNotification("✅ Stok berhasil ditambahkan");

      setTimeout(() => setNotification(""), 3000);
      fetchStok();

    } catch (err) {
      console.error("Gagal menambah stok:", err);
    }
  };

  const getStockByName = (name) => {
    return calculatePackageStock(name);
  };

  const getCurrentDockInfo = (status) => {
    const dockIndex = status.findIndex((val) => val === 1);
    return {
      dockNumber: dockIndex !== -1 ? dockIndex + 1 : null,
      message: dockIndex !== -1
        ? `Barang telah sampai di Dock ${dockIndex + 1}`
        : "Menunggu aktivitas...",
      isActive: dockIndex !== -1
    };
  };

  const robot1Data = robots[0] || { 
    robotId: "AMR 1",
    robotType: "Autonomous Mobile Robot",
    status: "unknown",
    batteryLevel: "0",
    runTime: 0,
    errorMessage: null
  };
  const robot2Data = robots[1] || { 
    robotId: "AMR 2",
    robotType: "Autonomous Mobile Robot", 
    status: "unknown",
    batteryLevel: "0",
    runTime: 0,
    errorMessage: null
  };

  // WebSocket connection
  useEffect(() => {
    window.ws = new WebSocket("ws://localhost:1880/infopaket");

    window.ws.onopen = () => {
      console.log("WebSocket connected");
    };

    window.ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        
        if (data.trigger) {
          if (data.trigger === "paket_a") {
            setTotalPaket(prev => ({ ...prev, paket_a: Math.max(0, prev.paket_a - 1) }));
          } else if (data.trigger === "paket_b") {
            setTotalPaket(prev => ({ ...prev, paket_b: Math.max(0, prev.paket_b - 1) }));
          } else if (data.trigger === "paket_c") {
            setTotalPaket(prev => ({ ...prev, paket_c: Math.max(0, prev.paket_c - 1) }));
          }
        }

        if (data.status === "ok") {
          setRequestStatus("✅ Berhasil mengirim data ke Cobot");
        }
      } catch (err) {
        console.error("Error parsing WebSocket message:", err);
      }
    };

    return () => {
      if (window.ws) {
        window.ws.close();
      }
    };
  }, [setTotalPaket]);

  const totalOutgoing = Object.values(totalPaket).reduce((a, b) => a + b, 0);

  return (
    <div className="relative min-h-screen bg-gray-900">
      <AnimatedBackground />
      
      <div className="relative z-10 p-6 max-w-7xl mx-auto">
        {/* Header with Robot Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Left - Title and Time */}
          <div className="lg:col-span-1 bg-gray-800/30 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
            <WarehouseIcon className="w-8 h-8 text-indigo-400" />
            <h1 className="text-3xl font-bold text-white mb-2">User Dashboard</h1>
            <p className="text-gray-400 mb-4">Warehouse Management System</p>
            {/* <div className="text-sm text-gray-400">
              <p>{currentTime.toLocaleDateString('id-ID', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}</p>
              <p className="text-2xl font-bold text-white tabular-nums mt-1">
                {currentTime.toLocaleTimeString('id-ID')}
              </p>
            </div> */}
          </div>

          {/* Robot Status Cards */}
          <div className="lg:col-span-2 grid grid-cols-2 gap-4">
            <MiniCardRobot
              robot={robot1Data}
              indicatorStatus={indicatorStatus}
              ledType="led1"
              pageType="wh"
              darkMode={true}
            />
            <MiniCardRobot
              robot={robot2Data}
              indicatorStatus={indicatorStatus}
              ledType="led2"
              pageType="user"
              darkMode={true}
            />
          </div>
        </div>

        {/* Notifications */}
        {notification && (
          <div className="mb-6 bg-emerald-500/20 border border-emerald-500/50 text-emerald-400 
            p-4 rounded-xl flex items-center gap-3 animate-slideIn">
            <CheckCircle className="w-5 h-5" />
            <span>{notification}</span>
          </div>
        )}

        {error && (
          <div className="mb-6 bg-rose-500/20 border border-rose-500/50 text-rose-400 
            p-4 rounded-xl flex items-center gap-3 animate-slideIn">
            <AlertCircle className="w-5 h-5" />
            <span>{error}</span>
          </div>
        )}

        {/* Action Buttons with Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
          <button 
            onClick={runAllRobots}
            disabled={isRunning}
            className="group relative overflow-hidden bg-gradient-to-r from-blue-600 to-blue-700 
              text-white px-6 py-4 rounded-xl font-semibold transition-all duration-300 
              hover:shadow-2xl hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="relative z-10 flex items-center justify-center gap-3">
              <PlayCircle className="w-5 h-5" />
              {isRunning ? "RUNNING..." : "Run Robot"}
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-blue-800 
              translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
          </button>
          
          <button 
            onClick={() => setIsModalOpen(true)}
            className="group relative overflow-hidden bg-gradient-to-r from-purple-600 to-purple-700 
              text-white px-6 py-4 rounded-xl font-semibold transition-all duration-300 
              hover:shadow-2xl hover:scale-[1.02]"
          >
            <div className="relative z-10 flex items-center justify-center gap-3">
              <Package className="w-5 h-5" />
              Request
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-purple-700 to-purple-800 
              translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
          </button>
          
          <button 
            onClick={() => setIsStockModalOpen(true)}
            className="group relative overflow-hidden bg-gradient-to-r from-emerald-600 to-emerald-700 
              text-white px-6 py-4 rounded-xl font-semibold transition-all duration-300 
              hover:shadow-2xl hover:scale-[1.02]"
          >
            <div className="relative z-10 flex items-center justify-center gap-3">
              <Plus className="w-5 h-5" />
              Add Stock
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-700 to-emerald-800 
              translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
          </button>

          {/* Quick Stats */}
          <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl p-4 border border-gray-700/50">
            <div className="flex items-center justify-between h-full">
              <div>
                <p className="text-xs text-gray-400">Pending</p>
                <p className="text-2xl font-bold text-amber-400">{pendingList.length}</p>
              </div>
              <Clock className="w-6 h-6 text-amber-400/30" />
            </div>
          </div>

          <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl p-4 border border-gray-700/50">
            <div className="flex items-center justify-between h-full">
              <div>
                <p className="text-xs text-gray-400">Total Out</p>
                <p className="text-2xl font-bold text-emerald-400">{totalOutgoing}</p>
              </div>
              <Activity className="w-6 h-6 text-emerald-400/30" />
            </div>
          </div>
        </div>

        {/* Tracking Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <TrackingCard
            amrNumber={1}
            title="AMR 1"
            status={statusAmr1}
            dockInfo={getCurrentDockInfo(statusAmr1)}
            accentColor="green"
            robotData={robot1Data}
          />
          <TrackingCard
            amrNumber={2}
            title="AMR 2 - Manipulator Robot"
            status={statusAmr2}
            dockInfo={getCurrentDockInfo(statusAmr2)}
            accentColor="red"
            robotData={robot2Data}
          />
        </div>

        {/* Main Content */}
        <div className="space-y-6">
          {/* Tab Navigation */}
          <div className="flex space-x-1 bg-gray-800/30 backdrop-blur-sm rounded-xl p-1 border border-gray-700/50">
            {[
              { id: 'inventory', label: 'Inventori', icon: Box },
              { id: 'requests', label: 'Request Status', icon: Clock },
              { id: 'packages', label: 'Info Paket', icon: Package }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg 
                  text-sm font-medium transition-all duration-300 ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg'
                    : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="bg-gray-800/30 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50 
            min-h-[500px]">
            {activeTab === 'inventory' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                  <Box className="w-6 h-6 text-blue-400" />
                  Stok Barang & Total Paket Keluar
                </h2>
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                  {['a', 'b', 'c'].map((paket) => (
                    <StockCard
                      key={paket}
                      paket={paket}
                      stock={getStockByName(paket)}
                      composition={packageComposition?.[paket]}
                    />
                  ))}
                </div>

                <div className="bg-gray-900/30 rounded-xl p-6 border border-gray-700/50">
                  <h3 className="text-lg font-semibold text-white mb-4">Detail Paket Keluar</h3>
                  <div className="grid grid-cols-3 gap-4">
                    {Object.entries(totalPaket).map(([paket, total]) => (
                      <div key={paket} className="text-center">
                        <div className="text-3xl font-bold text-white mb-1">{total}</div>
                        <div className="text-sm text-gray-400">
                          {paket.replace('paket_', 'Paket ').toUpperCase()}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'requests' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                  <Clock className="w-6 h-6 text-blue-400" />
                  Status Request
                </h2>
                
                {/* Pending Requests */}
                {pendingList.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-amber-400 mb-4 flex items-center gap-2">
                      <AlertCircle className="w-5 h-5" />
                      Pending ({pendingList.length})
                    </h3>
                    <div className="space-y-3">
                      {pendingList.map((request, index) => (
                        <RequestItem key={request.id} request={request} index={index} />
                      ))}
                    </div>
                  </div>
                )}

                {/* All Requests */}
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">Semua Request</h3>
                  <div className="space-y-3 max-h-96 overflow-y-auto custom-scrollbar pr-2">
                    {requestList.map((request, index) => (
                      <RequestItem key={request.id} request={request} index={index} />
                    ))}
                    {requestList.length === 0 && (
                      <div className="text-center py-12 text-gray-500">
                        {isLoading ? "Memuat data..." : "Belum ada request"}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'packages' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                  <Package className="w-6 h-6 text-blue-400" />
                  Informasi Paket
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {['a', 'b', 'c'].map((paket) => (
                    <PackageInfoCard
                      key={paket}
                      paket={paket}
                      composition={packageComposition?.[paket]}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Request Modal */}
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Request Paket">
          <form onSubmit={handleSubmitRequest} className="space-y-4">
            {['paket_a', 'paket_b', 'paket_c'].map((paket) => (
              <div key={paket}>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  {paket.replace('paket_', 'Paket ').toUpperCase()}
                </label>
                <input 
                  type="number" 
                  value={packageQuantities[paket]} 
                  onChange={(e) => setPackageQuantities(prev => ({
                    ...prev,
                    [paket]: Number(e.target.value)
                  }))}
                  min="0"
                  className="w-full px-4 py-2 bg-gray-900/50 border border-gray-600 rounded-lg 
                    text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0"
                />
              </div>
            ))}

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Nama Pengirim
              </label>
              <input 
                type="text"
                value={requestedBy}
                onChange={(e) => setRequestedBy(e.target.value)}
                required
                className="w-full px-4 py-2 bg-gray-900/50 border border-gray-600 rounded-lg 
                  text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Masukkan nama pengirim"
              />
            </div>

            <div className="flex gap-3 pt-4">
              <button 
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="flex-1 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 
                  transition-colors"
              >
                Batal
              </button>
              <button 
                type="submit"
                className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white 
                  rounded-lg hover:shadow-lg transition-all duration-300 flex items-center 
                  justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                Kirim Request
              </button>
            </div>
          </form>
        </Modal>

        {/* Stock Modal */}
        <Modal isOpen={isStockModalOpen} onClose={() => setIsStockModalOpen(false)} title="Tambah Stok">
          <form onSubmit={handleAddStock} className="space-y-4">
            {['a', 'b', 'c'].map((paket) => (
              <div key={paket}>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Paket {paket.toUpperCase()}
                  <span className="text-gray-500 text-xs ml-2">
                    (Stok saat ini: {getStockByName(paket)})
                  </span>
                </label>
                <input 
                  type="number" 
                  value={stockToAdd[paket]} 
                  onChange={(e) => setStockToAdd(prev => ({
                    ...prev,
                    [paket]: Number(e.target.value)
                  }))}
                  min="0"
                  className="w-full px-4 py-2 bg-gray-900/50 border border-gray-600 rounded-lg 
                    text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  placeholder="0"
                />
              </div>
            ))}

            <div className="flex gap-3 pt-4">
              <button 
                type="button"
                onClick={() => setIsStockModalOpen(false)}
                className="flex-1 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 
                  transition-colors"
              >
                Batal
              </button>
              <button 
                type="submit"
                className="flex-1 px-4 py-2 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white 
                  rounded-lg hover:shadow-lg transition-all duration-300 flex items-center 
                  justify-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Tambah Stok
              </button>
            </div>
          </form>
        </Modal>
      </div>

      {/* Custom Styles */}
      <style jsx>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes modalSlideIn {
          from {
            opacity: 0;
            transform: scale(0.9) translateY(20px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
        
        .animate-blob {
          animation: blob 7s infinite;
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        
        .animate-slideIn {
          animation: slideIn 0.5s ease-out;
        }
        
        .animate-modalSlideIn {
          animation: modalSlideIn 0.3s ease-out;
        }
        
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.1);
          border-radius: 3px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 3px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.2);
        }
      `}</style>
    </div>
  );
};

export default UserPage;
