import React, { useState, useEffect } from "react";
import { 
  Package, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Box,
  Activity,
  BatteryCharging,
  PlayCircle,
  Search,
  PauseCircle,
  Warehouse,
  Database,
} from 'lucide-react';
import CounterBarang from "../components/CounterBarang";
import useKukaLiveData from "../hooks/KukaData";
import useRequestData from "../hooks/useRequestData";
// import useWMSData from "../hooks/useWMSdata";
import kukaImg from "../assets/kuka.png";
// import { AMR1_LABELS, AMR2_LABELS } from '../config/robotConfig';
// import { getCurrentDockInfo } from "../config/robotConfig";

// Animated Background
const AnimatedBackground = () => (
  <div className="fixed inset-0 -z-10">
    <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-indigo-900/20 to-gray-900"></div>
    <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob"></div>
    <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>
    <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-4000"></div>
  </div>
);

// Mini Card Robot Component
const MiniCardRobot = ({ robot, indicatorStatus, ledType, pageType, darkMode = true }) => {
  const isMoving = robot.status?.toLowerCase() === "moving";
  const currentLED = indicatorStatus?.[ledType] || "OFF";
  const statusLEDColor = currentLED === "ON" ? "bg-green-500" : "bg-red-500";
  const statusLEDText = currentLED === "ON" ? "Menyala" : "Mati";
  const batteryLevel = parseInt(robot.batteryLevel) || 0;
  const isAMR1 = robot.robotId === "AMR 1";

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

   const formatRunTime = (minutes) => {
        if (isNaN(minutes)) return "0h 0m";
        const hrs = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return `${hrs}h ${mins}m`;
    };

  return (
    <div className="group relative overflow-hidden rounded-2xl shadow-xl transition-all duration-500 hover:shadow-2xl hover:-translate-y-1">
      <div className={`absolute inset-0 bg-gradient-to-br ${
        isAMR1 
          ? 'from-green-900/90 via-green-800/80 to-green-700/90' 
          : 'from-cyan-500/90 via-blue-700/80 to-indigo-900/90'
      } opacity-90`}></div>
      
      <div className="relative z-10 p-4">
        <div className="text-center mb-3">
          <h3 className="text-xl font-bold text-white">{robot.robotId}</h3>
          <p className="text-xs text-gray-200 opacity-90">{robot.robotType || "AMR"}</p>
        </div>

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

        <div className="flex justify-center items-center gap-2 mb-3">
          <div className="relative">
            <div className={`w-6 h-6 rounded-full ${statusLEDColor} shadow-lg`}></div>
            {currentLED === "ON" && (
              <div className={`absolute inset-0 w-6 h-6 rounded-full ${statusLEDColor} animate-ping`}></div>
            )}
          </div>
          <span className="text-xs text-white">{statusLEDText}</span>
        </div>

        <div className="grid grid-cols-2 gap-2">
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

          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-2 border border-white/20">
            <div className="flex items-center justify-center gap-1">
              <BatteryCharging className={`w-4 h-4 ${getBatteryColor(batteryLevel)}`} />
              <span className={`text-xs font-bold ${getBatteryColor(batteryLevel)}`}>
                {batteryLevel}%
              </span>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-2 border border-white/20">
            <div className="text-center">
              <Activity className="w-4 h-4 text-blue-400 mx-auto" />
              <span className="text-xs font-bold text-white">
                {formatRunTime(robot.runTime)}
              </span>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-2 border border-white/20">
            <div className="text-center">
              <AlertCircle className={`w-4 h-4 mx-auto ${robot.errorMessage ? 'text-orange-400' : 'text-gray-400'}`} />
              <span className={`text-xs font-bold ${robot.errorMessage ? 'text-orange-400' : 'text-gray-400'}`}>
                {robot.errorMessage}
              </span>
            </div>
          </div>
        </div>

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

// Request Card Component
const RequestCard = ({ request, index }) => {
  const statusConfig = {
    pending: {
      color: 'text-amber-400 bg-amber-400/10 border-amber-400/30',
      icon: Clock,
      text: 'Pending'
    },
    completed: {
      color: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/30',
      icon: CheckCircle,
      text: 'Finish'
    },
    processing: {
      color: 'text-blue-400 bg-blue-400/10 border-blue-400/30',
      icon: Activity,
      text: 'Processing'
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
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 
              flex items-center justify-center">
              <span className="text-sm font-bold text-indigo-400">#{index + 1}</span>
            </div>
            <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-gray-800 
              flex items-center justify-center border border-gray-700">
              <Package className="w-3 h-3 text-gray-400" />
            </div>
          </div>
          
          <div>
            <div className="flex items-center gap-3">
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
              {new Date(request.created_at || request.createdAt).toLocaleTimeString('id-ID', {
                hour: '2-digit',
                minute: '2-digit'
              })}
            </p>
            <p className="text-xs text-gray-600">
              {new Date(request.created_at || request.createdAt).toLocaleDateString('id-ID', {
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

// Stock Item Component
const StockItem = ({ stock, index }) => {
  const getStockStatus = (jumlah) => {
    if (jumlah > 50) return { color: 'text-emerald-400', bg: 'bg-emerald-400/10', status: 'Aman' };
    if (jumlah > 20) return { color: 'text-amber-400', bg: 'bg-amber-400/10', status: 'Menipis' };
    return { color: 'text-rose-400', bg: 'bg-rose-400/10', status: 'Kritis' };
  };

  const status = getStockStatus(stock.jumlah);

  return (
    <div 
      className="group bg-gray-800/30 hover:bg-gray-800/50 rounded-xl p-4 
        border border-gray-700/30 hover:border-gray-600/50 transition-all duration-300"
      style={{
        animationDelay: `${index * 100}ms`,
        animation: 'slideIn 0.5s ease-out forwards',
        opacity: 0
      }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 
            flex items-center justify-center">
            <Box className="w-6 h-6 text-indigo-400" />
          </div>
          
          <div>
            <h4 className="font-semibold text-white capitalize">{stock.nama_barang}</h4>
            <div className="flex items-center gap-3 mt-1">
              <span className={`text-xs px-2 py-0.5 ${status.bg} ${status.color} rounded-md font-medium`}>
                {status.status}
              </span>
              <span className="text-xs text-gray-400">
                {stock.jumlah} <span className="text-sm text-gray-400 font-normal">unit</span>
              </span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="flex gap-4 text-sm">
            <div className="text-center">
              <p className="text-emerald-400 font-bold">{stock.paket_a}</p>
              <p className="text-xs text-gray-500">A</p>
            </div>
            <div className="text-center">
              <p className="text-blue-400 font-bold">{stock.paket_b}</p>
              <p className="text-xs text-gray-500">B</p>
            </div>
            <div className="text-center">
              <p className="text-purple-400 font-bold">{stock.paket_c}</p>
              <p className="text-xs text-gray-500">C</p>
            </div>
          </div>
          
          <div className={`text-2xl font-bold ${status.color}`}>
            {stock.jumlah}
          </div>
        </div>
      </div>
    </div>
  );
};

// Stats Card Component// Stats Card Component (lanjutan)
const StatsCard = ({ title, value, icon: Icon, color }) => (
  <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-sm text-gray-400">{title}</p>
        <p className={`text-3xl font-bold ${color} mt-1`}>{value}</p>
      </div>
      <Icon className={`w-8 h-8 ${color} opacity-30`} />
    </div>
  </div>
);

const WHPage = () => {

  const { robots, indicatorStatus } = useKukaLiveData("amr1", "led1", "wh");
  const { requestList, stokData } = useRequestData();
  
  const [activeTab, setActiveTab] = useState('requests');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update time
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Calculate stats
  const totalStock = stokData.reduce((sum, item) => sum + (item.jumlah || 0), 0);
  // const lowStockItems = stokData.filter(item => item.jumlah < 20).length;
  const pendingRequests = requestList.filter(req => req.status === 'pending').length;
  const completedRequests = requestList.filter(req => req.status === 'completed').length;

  // Filter data untuk tab aktif
  const filteredRequests = requestList.filter(request => 
    searchTerm === '' || request.id.toString().includes(searchTerm)
  );

  const filteredStock = stokData.filter(stock =>
    searchTerm === '' || stock.nama_barang.toLowerCase().includes(searchTerm.toLowerCase())
  );


  // // Filter functions
  // const filteredRequests = requestList.filter(request => 
  //   searchTerm === '' || 
  //   request.status.toLowerCase().includes(searchTerm.toLowerCase())
  // );

  // const filteredStock = StockList.filter(stock =>
  //   searchTerm === '' ||
  //   stock.nama_barang.toLowerCase().includes(searchTerm.toLowerCase())
  // );

  const robot1Data = robots[0] || { 
    robotId: "AMR 1",
    robotType: "Warehouse Robot",
    status: "unknown",
    batteryLevel: "0",
    runTime: 0,
    errorMessage: null
  };
  
  const robot2Data = robots[1] || { 
    robotId: "AMR 2",
    robotType: "Delivery Robot", 
    status: "unknown",
    batteryLevel: "0",
    runTime: 0,
    errorMessage: null
  };

  return (
    <div className="relative min-h-screen bg-gray-900">
      <AnimatedBackground />
      
      <div className="relative z-10 p-6 max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Title and Info */}
          <div className="lg:col-span-1 bg-gray-800/30 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
            <div className="flex items-center gap-3 mb-4">
              <Warehouse className="w-8 h-8 text-indigo-400" />
              <h1 className="text-3xl font-bold text-white">Warehouse</h1>
            </div>
            <p className="text-gray-400 mb-4">Management System</p>
            <div className="text-sm text-gray-400">
              <p>{currentTime.toLocaleDateString('id-ID', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}</p>
              <p className="text-2xl font-bold text-white tabular-nums mt-1">
                {currentTime.toLocaleTimeString('id-ID')}
              </p>
            </div>
          </div>

          {/* Robot Cards */}
          <div className="lg:col-span-2 grid grid-cols-2 gap-4">
            <MiniCardRobot
              robot={robot2Data}
              indicatorStatus={indicatorStatus}
              ledType="led2"
              pageType="user"
              darkMode={true}
            />
            <MiniCardRobot
              robot={robot1Data}
              indicatorStatus={indicatorStatus}
              ledType="led1"
              pageType="wh"
              darkMode={true}
            />
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          <StatsCard
            title="Total Stok"
            value={totalStock}
            icon={Database}
            color="text-blue-400"
          />
          {/* <StatsCard
            title="Stok Rendah"
            value={lowStockItems}
            icon={AlertCircle}
            color="text-amber-400"
          /> */}
          <StatsCard
            title="Request Pending"
            value={pendingRequests}
            icon={Clock}
            color="text-orange-400"
          />
          <StatsCard
            title="Request Selesai"
            value={completedRequests}
            icon={CheckCircle}
            color="text-emerald-400"
          />
        </div>


        <div className="flex flex-col md:flex-row gap-4 mb-6">

          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Cari data..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-gray-800/50 border border-gray-700 rounded-xl 
                text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 
                focus:border-transparent transition-all duration-300"
            />
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 bg-gray-800/30 backdrop-blur-sm rounded-xl p-1 border border-gray-700/50 mb-6">
          {[
            { id: 'requests', label: 'All Request Package', icon: Package },
            { id: 'stock', label: 'Stock Package', icon: Box },
            { id: 'counter', label: 'Counter', icon: Activity }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg 
                text-sm font-medium transition-all duration-300 ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-lg'
                  : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="bg-gray-800/30 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50 min-h-[600px]">
          {activeTab === 'requests' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                <Package className="w-6 h-6 text-indigo-400" />
                Package Request List
              </h2>
              
              <div className="space-y-3 max-h-[500px] overflow-y-auto custom-scrollbar pr-2">
                {filteredRequests.map((request, index) => (
                  <RequestCard key={request.id} request={request} index={index} />
                ))}
                {filteredRequests.length === 0 && (
                  <div className="text-center py-12 text-gray-500">
                    <Package className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>Tidak ada request barang</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'stock' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                <Box className="w-6 h-6 text-indigo-400" />
                Package Stock List
              </h2>
              
              <div className="space-y-3 max-h-[500px] overflow-y-auto custom-scrollbar pr-2">
                {filteredStock.map((stock, index) => (
                  <StockItem key={stock.id} stock={stock} index={index} />
                ))}
                {filteredStock.length === 0 && (
                  <div className="text-center py-12 text-gray-500">
                    <Box className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>Tidak ada data stok</p>
                  </div>
                )}
              </div>

              {/* Package Info */}
              <div className="mt-6 p-4 bg-gray-900/50 rounded-xl border border-gray-700/50">
                <h3 className="text-lg font-semibold text-white mb-3">Package Composition Information:</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-3">
                    <h4 className="text-emerald-400 font-semibold mb-2">Paket A</h4>
                    <p className="text-sm text-gray-300">2 Photoelectric, 1 Limit Switch, 3 Inductive</p>
                  </div>
                  <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3">
                    <h4 className="text-blue-400 font-semibold mb-2">Paket B</h4>
                    <p className="text-sm text-gray-300">1 Photoelectric, 3 Limit Switch</p>
                  </div>
                  <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-3">
                    <h4 className="text-purple-400 font-semibold mb-2">Paket C</h4>
                    <p className="text-sm text-gray-300">4 Photoelectric, 1 Limit Switch, 1 Inductive</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'counter' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                <Activity className="w-6 h-6 text-indigo-400" />
                Counter Box
              </h2>
              
              <div className="bg-gray-900/50 rounded-xl p-6 border border-gray-700/50">
                <CounterBarang darkMode={true} />
              </div>
            </div>
          )}
        </div>
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
        
        .animate-blob {
          animation: blob 7s infinite;
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        
        .animation-delay-4000 {
          animation-delay: 4s;
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

export default WHPage;
