import React, { useState, useEffect } from 'react';
import { 
  PackageOpen, 
  TrendingUp, 
  Activity, 
  BatteryCharging, 
  Wifi, 
  Clock,
  Box,
  Zap,
  AlertCircle,
  CheckCircle,
  ArrowUp,
  ArrowDown,
  Cpu,
  Server,
  BarChart3,
  Navigation
} from 'lucide-react';
import useRequestData from '../hooks/useRequestData';
import { useFlowStatus } from "../hooks/useFlowStatus";
import TrackingCard from '../components/TrackingCard';
import useKukaLiveData from "../hooks/KukaData";

// Animated Background Component
const AnimatedBackground = () => (
  <div className="fixed inset-0 -z-10 overflow-hidden">
    <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob"></div>
    <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-yellow-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob animation-delay-2000"></div>
    <div className="absolute top-40 left-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob animation-delay-4000"></div>
  </div>
);

// Enhanced Mini Robot Card
const MiniRobotCard = ({ robot, indicatorStatus, ledType, title, accentColor, index }) => {
  const isMoving = robot.status?.toLowerCase() === "moving";
  const currentLED = indicatorStatus?.[ledType] || "OFF";
  const batteryLevel = parseInt(robot.batteryLevel) || 0;
  
  const getBatteryColor = (level) => {
    if (level > 60) return "text-emerald-400";
    if (level > 30) return "text-amber-400";
    return "text-rose-400";
  };

  const gradientClass = accentColor === 'green' 
    ? 'from-emerald-900/20 to-emerald-800/20 border-emerald-700/50' 
    : 'from-rose-900/20 to-rose-800/20 border-rose-700/50';

  return (
    <div className={`relative bg-gradient-to-br ${gradientClass} backdrop-blur-sm rounded-2xl p-5 border 
      hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 group overflow-hidden`}>
      
      {/* Animated Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}></div>
      </div>
      
      {/* Glow Effect */}
      <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${
        accentColor === 'green' ? 'from-emerald-500/20' : 'from-rose-500/20'
      } to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
      
      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`relative w-12 h-12 rounded-xl bg-gradient-to-br ${
              accentColor === 'green' ? 'from-emerald-500 to-emerald-600' : 'from-rose-500 to-rose-600'
            } flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow`}>
              <Cpu className="w-6 h-6 text-white" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">{title}</h4>
              <p className="text-xs text-gray-400">AMR Unit {index + 1}</p>
            </div>
          </div>
          <div className="relative">
            <div className={`w-3 h-3 rounded-full ${
              currentLED === "ON" ? 'bg-emerald-400' : 'bg-gray-600'
            }`}></div>
            {currentLED === "ON" && (
              <div className="absolute inset-0 w-3 h-3 rounded-full bg-emerald-400 animate-ping"></div>
            )}
          </div>
        </div>
        
        {/* Status Grid */}
        <div className="grid grid-cols-2 gap-3 mb-3">
          {/* Status Box */}
          <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-3 border border-gray-800">
            <div className="flex items-center gap-1 mb-1">
              <Zap className="w-3 h-3 text-gray-400" />
              <span className="text-xs text-gray-400">Status</span>
            </div>
            <span className={`text-sm font-semibold ${isMoving ? 'text-emerald-400' : 'text-gray-500'}`}>
              {robot.status || "Unknown"}
            </span>
          </div>
          
          {/* Battery Box */}
          <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-3 border border-gray-800">
            <div className="flex items-center gap-1 mb-1">
              <BatteryCharging className="w-3 h-3 text-gray-400" />
              <span className="text-xs text-gray-400">Battery</span>
            </div>
            <span className={`text-sm font-semibold ${getBatteryColor(batteryLevel)}`}>
              {batteryLevel}%
            </span>
          </div>
        </div>
        
        {/* Battery Bar */}
        <div className="relative">
          <div className="absolute -left-5 -right-5 h-8 bg-gradient-to-r from-transparent via-white/5 to-transparent 
            blur-xl transition-all duration-1000"></div>
          <div className="relative w-full bg-gray-800 rounded-full h-2 overflow-hidden">
            <div 
              className={`h-full transition-all duration-1000 ease-out relative ${
                batteryLevel > 60 ? 'bg-gradient-to-r from-emerald-400 to-emerald-500' : 
                batteryLevel > 30 ? 'bg-gradient-to-r from-amber-400 to-amber-500' : 
                'bg-gradient-to-r from-rose-400 to-rose-500'
              }`}
              style={{ width: `${batteryLevel}%` }}
            >
              <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
            </div>
          </div>
        </div>
        
        {/* Connection Status */}
        <div className="flex items-center justify-center mt-3 py-2 bg-gray-900/30 rounded-lg backdrop-blur-sm">
          <div className="flex items-center gap-2">
            <Wifi className={`w-4 h-4 ${isMoving ? 'text-emerald-400 animate-pulse' : 'text-gray-600'}`} />
            <span className={`text-xs font-medium ${isMoving ? 'text-emerald-400' : 'text-gray-600'}`}>
              {isMoving ? 'Connected' : 'Idle'}
            </span>
            {isMoving && (
              <div className="flex gap-0.5">
                <div className="w-1 h-3 bg-emerald-400 rounded-full animate-wave"></div>
                <div className="w-1 h-3 bg-emerald-400 rounded-full animate-wave animation-delay-200"></div>
                <div className="w-1 h-3 bg-emerald-400 rounded-full animate-wave animation-delay-400"></div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Enhanced Stats Card
const StatsCard = ({ icon: Icon, title, value, subtitle, trend, color }) => {
  const colorClasses = {
    green: 'from-emerald-500 to-emerald-600',
    blue: 'from-blue-500 to-blue-600',
    purple: 'from-purple-500 to-purple-600',
    amber: 'from-amber-500 to-amber-600'
  };

  return (
    <div className="relative bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50 
      hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 group overflow-hidden">
      
      {/* Animated Background */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <div className={`absolute -inset-10 bg-gradient-to-br ${colorClasses[color]} blur-3xl opacity-10`}></div>
      </div>
      
      {/* Background Pattern */}
      <div className={`absolute inset-0 bg-gradient-to-br ${colorClasses[color]} opacity-5 
        group-hover:opacity-10 transition-opacity duration-300`}></div>
      
      {/* Content */}
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div className={`relative w-14 h-14 rounded-2xl bg-gradient-to-br ${colorClasses[color]} 
            flex items-center justify-center shadow-lg group-hover:shadow-xl transform 
            group-hover:rotate-6 transition-all duration-300`}>
            <Icon className="w-7 h-7 text-white" />
            <div className="absolute -inset-1 rounded-2xl bg-gradient-to-br from-white/20 to-transparent 
              opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>
          {trend !== undefined && (
            <div className={`flex items-center gap-1 px-3 py-1.5 rounded-lg backdrop-blur-sm ${
              trend > 0 
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
            }`}>
              {trend > 0 ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
              <span className="text-xs font-bold">{Math.abs(trend)}%</span>
            </div>
          )}
        </div>
        
        <h3 className="text-gray-400 text-sm font-medium mb-2">{title}</h3>
        <div className="flex items-baseline gap-2">
          <p className="text-4xl font-bold text-white group-hover:scale-105 transition-transform duration-300">
            {value}
          </p>
          {subtitle && (
            <p className="text-sm text-gray-500 font-medium">{subtitle}</p>
          )}
        </div>
      </div>
    </div>
  );
};

// Enhanced Activity Item
const ActivityItem = ({ request, index }) => {
  const statusConfig = {
    pending: {
      colors: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
      icon: Clock,
      label: 'Menunggu'
    },
    completed: {
      colors: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
      icon: CheckCircle,
      label: 'Selesai'
    },
    processing: {
      colors: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      icon: Activity,
      label: 'Diproses'
    }
  };

  const config = statusConfig[request.status] || statusConfig.pending;
  const StatusIcon = config.icon;

  return (
    <div 
      className="group flex items-center gap-4 p-4 bg-gray-800/30 hover:bg-gray-800/60 
      rounded-xl transition-all duration-200 cursor-pointer border border-gray-700/30 
      hover:border-gray-600/50 backdrop-blur-sm"
      style={{ 
        animationDelay: `${index * 100}ms`,  
        animation: 'slideInLeft 0.5s ease-out forwards',
        opacity: 0
      }}
    >
      {/* Number Badge */}
      <div className="flex-shrink-0">
        <div className="relative">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 
            flex items-center justify-center backdrop-blur-sm border border-blue-500/20 
            group-hover:scale-110 transition-transform duration-300">
            <span className="text-sm font-bold text-blue-400">#{request.id}</span>
          </div>
          <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-gray-800 
            flex items-center justify-center">
            <PackageOpen className="w-2.5 h-2.5 text-gray-400" />
          </div>
        </div>
      </div>
      
      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-3 mb-1.5">
          <span className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors">
            {request.requested_by}
          </span>
          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs 
            font-semibold border backdrop-blur-sm ${config.colors}`}>
            <StatusIcon className="w-3.5 h-3.5" />
            {config.label}
          </span>
        </div>
        <div className="flex items-center gap-4 text-xs text-gray-400">
          <div className="flex items-center gap-2">
            {request.paket_a > 0 && (
              <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 rounded-md border border-emerald-500/20">
                A: {request.paket_a}
              </span>
            )}
            {request.paket_b > 0 && (
              <span className="px-2 py-0.5 bg-blue-500/10 text-blue-400 rounded-md border border-blue-500/20">
                B: {request.paket_b}
              </span>
            )}
            {request.paket_c > 0 && (
              <span className="px-2 py-0.5 bg-purple-500/10 text-purple-400 rounded-md border border-purple-500/20">
                C: {request.paket_c}
              </span>
            )}
          </div>
        </div>
      </div>
      
      {/* Time */}
      <div className="flex-shrink-0 text-right">
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
    </div>
  );
};

// Live Status Indicator
const LiveStatusIndicator = ({ status, label }) => {
  return (
    <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-800/50 backdrop-blur-sm 
      rounded-lg border border-gray-700/50">
      <div className="relative">
        <div className={`w-2 h-2 rounded-full ${status ? 'bg-emerald-400' : 'bg-gray-600'}`}></div>
        {status && (
          <div className="absolute inset-0 w-2 h-2 rounded-full bg-emerald-400 animate-ping"></div>
        )}
      </div>
      <span className="text-xs font-medium text-gray-300">{label}</span>
    </div>
  );
};

const HomePage = () => {
  const { totalPaket, requestList, error } = useRequestData();
  const { robots, indicatorStatus } = useKukaLiveData("amr2", "led2", "user");
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Calculate stats
  const totalPaketKeluar = Object.values(totalPaket).reduce((acc, val) => acc + val, 0);
  const activeRobots = robots.filter(r => r.status?.toLowerCase() === "moving").length;
  const pendingRequests = requestList.filter(r => r.status === 'pending').length;
  const completedToday = requestList.filter(r => {
    const today = new Date().toDateString();
    return r.status === 'completed' && new Date(r.created_at).toDateString() === today;
  }).length;

  const statusAmr1 = useFlowStatus("/statusAmr1");
  const statusAmr2 = useFlowStatus("/statusAmr2");

  const robot1Data = robots[0] || { batteryLevel: "0", status: "unknown" };
  const robot2Data = robots[1] || { batteryLevel: "0", status: "unknown" };

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

  // Recent activities (last 8)
  const recentActivities = requestList.slice(0, 8);

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800">
      <AnimatedBackground />
      
      {/* Gradient Overlay */}
      <div className="fixed inset-0 bg-gradient-to-b from-transparent via-gray-900/50 to-gray-900 pointer-events-none"></div>
      
      <div className="relative z-10 p-6 space-y-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-gray-800/30 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 
                  flex items-center justify-center shadow-lg">
                  <Server className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-white">Dashboard Monitoring</h1>
                  <p className="text-gray-400">Sistem Warehouse Management</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-6">
              <LiveStatusIndicator status={true} label="System Online" />
              <div className="text-right">
                <p className="text-sm text-gray-400">
                  {currentTime.toLocaleDateString('id-ID', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </p>
                <p className="text-2xl font-bold text-white tabular-nums">
                  {currentTime.toLocaleTimeString('id-ID')}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="relative overflow-hidden bg-rose-500/20 border border-rose-500/50 text-rose-400 
            p-4 rounded-xl flex items-center gap-3 backdrop-blur-sm">
            <div className="absolute inset-0 bg-gradient-to-r from-rose-500/0 via-rose-500/10 to-rose-500/0 
              animate-pulse"></div>
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span className="relative z-10">{error.message}</span>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            icon={TrendingUp}
            title="Total Paket Keluar"
            value={totalPaketKeluar}
            subtitle="Semua waktu"
            trend={12}
            color="green"
          />
          <StatsCard
            icon={Activity}
            title="Robot Aktif"
            value={`${activeRobots}/${robots.length}`}
            subtitle="Unit beroperasi"
            color="blue"
          />
          <StatsCard
            icon={Clock}
            title="Request Pending"
            value={pendingRequests}
            subtitle="Menunggu proses"
            trend={-5}
            color="amber"
          />
          <StatsCard
            icon={CheckCircle}
            title="Selesai Hari Ini"
            value={completedToday}
            subtitle="Request sukses"
            trend={8}
            color="purple"
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Activity Feed - 2 columns */}
          <div className="lg:col-span-2 bg-gray-800/30 backdrop-blur-sm rounded-2xl p-6 
            border border-gray-700/50">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 
                  flex items-center justify-center">
                  <BarChart3 className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Aktivitas Terkini</h3>
                  <p className="text-sm text-gray-400">Real-time request monitoring</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
                <span className="text-xs text-gray-400">Live</span>
              </div>
            </div>
            
            <div className="space-y-3 max-h-[480px] overflow-y-auto custom-scrollbar pr-2">
              {recentActivities.map((request, index) => (
                <ActivityItem key={request.id} request={request} index={index} />
              ))}
              {recentActivities.length === 0 && (
                <div className="text-center py-12">
                  <Box className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                  <p className="text-gray-500">Tidak ada aktivitas terkini</p>
                </div>
              )}
            </div>
          </div>

          {/* Robot Status - 1 column */}
          <div className="space-y-4">
            <div className="bg-gray-800/30 backdrop-blur-sm rounded-2xl p-4 border border-gray-700/50">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 
                  flex items-center justify-center">
                  <Navigation className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-lg font-bold text-white">Status Robot</h3>
              </div>
              <div className="space-y-4">
                <MiniRobotCard
                  robot={robot1Data}
                  indicatorStatus={indicatorStatus}
                  ledType="led1"
                  title="Warehouse Robot"
                  accentColor="green"
                  index={0}
                />
                <MiniRobotCard
                  robot={robot2Data}
                  indicatorStatus={indicatorStatus}
                  ledType="led2"
                  title="User Robot"
                  accentColor="red"
                  index={1}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Tracking Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <TrackingCard
            amrNumber={1}
            title="AMR 1 "
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
      </div>

      {/* Custom Styles */}
      <style jsx>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        
        @keyframes wave {
          0%, 100% { transform: scaleY(1); }
          50% { transform: scaleY(0.5); }
        }
        
        @keyframes slideInLeft {
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

        .animation-delay-200 {
          animation-delay: 0.2s;
        }

        .animation-delay-400 {
          animation-delay: 0.4s;
        }
        
        .animate-wave {
          animation: wave 1s ease-in-out infinite;
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

export default HomePage;
