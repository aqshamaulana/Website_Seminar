import React, { useEffect, useState } from "react";
import { Bell, Activity, Calendar, Clock, Menu, X } from "lucide-react";

const Header = ({ onMenuClick }) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formattedTime = currentTime.toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  const formattedDate = currentTime.toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const formattedDateShort = currentTime.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <header className="relative bg-gray-900/95 backdrop-blur-xl border-b border-gray-800 shadow-2xl">
      {/* Decorative gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-900/10 via-transparent to-purple-900/10 pointer-events-none" />
      
      <div className="relative px-4 sm:px-6 py-3 sm:py-4">
        <div className="flex justify-between items-center">
          {/* Left Section - Mobile Menu & Title */}
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Mobile Menu Toggle */}
            <button 
              onClick={onMenuClick}
              className="lg:hidden p-2 bg-gray-800 rounded-lg border border-gray-700 
                hover:bg-gray-700 transition-all duration-300"
            >
              <Menu size={20} className="text-gray-400" />
            </button>

            {/* Status Indicator - Hidden on mobile */}
            <div className="relative hidden sm:block">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg blur opacity-20" />
              <div className="relative bg-gray-800 rounded-lg p-2 border border-gray-700">
                <Activity size={20} className="text-blue-400" />
              </div>
            </div>
            
            <div>
              <h1 className="text-base sm:text-lg md:text-xl font-bold text-gray-100 tracking-tight">
                Dashboard
              </h1>
              <p className="text-xs text-gray-400 font-medium hidden sm:block">
                Real-time System 
              </p>
            </div>
          </div>
          
          {/* Right Section - Time and Actions */}
          <div className="flex items-center gap-2 sm:gap-4 md:gap-6">
            {/* Date and Time - Responsive */}
            <div className="hidden md:flex items-center gap-4 px-4 py-2 bg-gray-800/50 rounded-xl border border-gray-700">
              <div className="flex items-center gap-2">
                <Calendar size={16} className="text-gray-400" />
                <p className="text-sm text-gray-300">{formattedDate}</p>
              </div>
              <div className="w-px h-6 bg-gray-700" />
              <div className="flex items-center gap-2">
                <Clock size={16} className="text-gray-400" />
                <p className="text-lg font-semibold text-gray-100 font-mono">{formattedTime}</p>
              </div>
            </div>

            {/* Mobile Time Display */}
            <div className="md:hidden flex items-center gap-2 px-3 py-1.5 bg-gray-800/50 rounded-lg border border-gray-700">
              <Clock size={14} className="text-gray-400" />
              <p className="text-sm font-semibold text-gray-100 font-mono">{formattedTime}</p>
            </div>
            
            {/* Mobile Actions Toggle */}
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="sm:hidden p-2 bg-gray-800 rounded-lg border border-gray-700 
                hover:bg-gray-700 transition-all duration-300"
            >
              {isMobileMenuOpen ? (
                <X size={20} className="text-gray-400" />
              ) : (
                <Bell size={20} className="text-gray-400" />
              )}
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            </button>
          </div>
        </div>
        
        {/* Mobile Menu Dropdown */}
        {isMobileMenuOpen && (
          <div className="sm:hidden absolute top-full left-0 right-0 bg-gray-900/95 backdrop-blur-xl 
            border-b border-gray-800 shadow-2xl z-50">
            <div className="p-4 space-y-3">
              {/* Date Display */}
              <div className="flex items-center gap-2 text-gray-300">
                <Calendar size={16} className="text-gray-400" />
                <p className="text-sm">{formattedDateShort}</p>
              </div>
          
            </div>
          </div>
        )}
        
        {/* Optional: System Status Bar - Responsive */}
        {/* <div className="mt-3 sm:mt-4 flex items-center gap-4 overflow-x-auto pb-1">
          <div className="flex-1 grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4 min-w-max">
            <StatusCard 
              label="System" 
              value="Online" 
              status="success"
              icon={<Activity size={14} />}
              compact
            />
            <StatusCard 
              label="Robots" 
              value="2/2" 
              status="success"
              trend="+100%"
              compact
            />
            <StatusCard 
              label="Queue" 
              value="3" 
              status="warning"
              trend="+2"
              compact
            />
            <StatusCard 
              label="Alerts" 
              value="0" 
              status="normal"
              trend="0"
              compact
            />
          </div>
        </div> */}
      </div>
    </header>
  );
};

// const StatusCard = ({ label, value, status, icon, trend, compact }) => {
//   const statusColors = {
//     success: "text-green-400 bg-green-400/10 border-green-400/20",
//     warning: "text-yellow-400 bg-yellow-400/10 border-yellow-400/20",
//     error: "text-red-400 bg-red-400/10 border-red-400/20",
//     normal: "text-gray-400 bg-gray-400/10 border-gray-400/20"
//   };

//   return (
//     <div className={`${compact ? 'px-2 py-1.5' : 'px-3 py-2'} rounded-lg border ${statusColors[status]} 
//       backdrop-blur-sm transition-all duration-300 hover:scale-[1.02]`}>
//       <div className="flex items-center justify-between">
//         <div className="flex items-center gap-1.5">
//           {icon && <span className="opacity-70">{icon}</span>}
//           <p className={`${compact ? 'text-xs' : 'text-xs'} font-medium opacity-70`}>{label}</p>
//         </div>
//         {trend && (
//           <span className={`${compact ? 'text-xs' : 'text-xs'} font-semibold`}>
//             {trend}
//           </span>
//         )}
//       </div>
//       <p className={`${compact ? 'text-sm' : 'text-lg'} font-bold mt-0.5`}>{value}</p>
//     </div>
//   );
// };

export default Header;
