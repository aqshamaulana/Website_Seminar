import React from "react";
import { Truck, MapPin, Navigation } from "lucide-react";
import DockPoint from "./DockPoint";
import { getColorClasses } from "../utils/colorClasses";

const TrackingCard = ({ amrNumber, title, status, dockInfo, accentColor, robotData }) => {
  const colors = getColorClasses(accentColor);
  // const batteryLevel = parseInt(robotData.batteryLevel) || 0;
  // const isMoving = robotData.status?.toLowerCase() === "moving";
  
  // const getBatteryColor = (level) => {
  //   if (level > 60) return "text-green-400";
  //   if (level > 30) return "text-yellow-400";
  //   return "text-red-400";
  // };

  return (
    <div className="bg-dark-secondary rounded-2xl overflow-hidden border border-gray-800 hover:border-gray-700 transition-all duration-300">
      {/* Header */}
      <div className={`relative px-6 py-4 bg-gradient-to-r from-gray-900 to-gray-800 border-b border-gray-800`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${colors.bgLight} ${colors.border} border`}>
              <Truck className={`w-5 h-5 ${colors.text}`} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">{title}</h3>
              <p className="text-xs text-gray-400 mt-0.5">Autonomous Mobile Robot</p>
            </div>
          </div>
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${
            dockInfo.isActive ? `${colors.bgLight} ${colors.border} border` : 'bg-gray-800 border border-gray-700'
          }`}>
            <div className={`w-2 h-2 rounded-full ${
              dockInfo.isActive ? `${colors.bg} animate-pulse` : 'bg-gray-500'
            }`}></div>
            <span className={`text-xs font-medium ${
              dockInfo.isActive ? colors.text : 'text-gray-400'
            }`}>
              {dockInfo.isActive ? 'In Transit' : 'Idle'}
            </span>
          </div>
        </div>
      </div>

      {/* Tracking Visual */}
      <div className="p-6">
        <div className="relative">
          {/* Progress Line */}
          <div className="absolute top-8 left-0 right-0 h-1 bg-gray-700 rounded-full">
            {dockInfo.dockNumber && (
              <div 
                className={`absolute top-0 left-0 h-full ${colors.bg} rounded-full transition-all duration-1000`}
                style={{ width: `${(dockInfo.dockNumber / status.length) * 100}%` }}
              />
            )}
          </div>

          {/* Dock Points */}
          <div className="relative flex justify-between">
            {status.map((val, i) => (
              <DockPoint
                key={i}
                dockNumber={i + 1}
                isActive={val === 1}
                isPassed={dockInfo.dockNumber ? i < dockInfo.dockNumber : false}
                colors={colors}
              />
            ))}
          </div>
        </div>

        {/* Status Message */}
        <div className={`mt-8 p-4 rounded-xl ${colors.bgLight} border ${colors.border}`}>
          <div className="flex items-start gap-3">
            <MapPin className={`w-5 h-5 ${colors.text} mt-0.5`} />
            <div className="flex-1">
              <p className="text-sm font-medium text-white mb-1">Current Status</p>
              <p className={`text-sm ${colors.text}`}>{dockInfo.message}</p>
              {dockInfo.isActive && (
                <div className="flex items-center gap-2 mt-2">
                  <Navigation className={`w-4 h-4 ${colors.text} animate-pulse`} />
                  <span className="text-xs text-gray-400">Estimated arrival: 2 minutes</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Additional Info
        <div className="grid grid-cols-3 gap-3 mt-4">
          <div className="bg-dark-tertiary rounded-lg p-3 text-center border border-gray-800">
            <p className="text-xs text-gray-500 mb-1">Status</p>
            <p className={`text-sm font-semibold ${
              isMoving ? 'text-green-400' : 'text-gray-400'
            }`}>
              {robotData.status || 'Unknown'}
            </p>
          </div>
          <div className="bg-dark-tertiary rounded-lg p-3 text-center border border-gray-800">
            <p className="text-xs text-gray-500 mb-1">Speed</p>
            <p className="text-sm font-semibold text-white">
              {dockInfo.isActive ? '5 km/h' : '0 km/h'}
            </p>
          </div>
          <div className="bg-dark-tertiary rounded-lg p-3 text-center border border-gray-800">
            <p className="text-xs text-gray-500 mb-1">Battery</p>
            <div className="flex flex-col items-center">
              <p className={`text-sm font-semibold ${getBatteryColor(batteryLevel)}`}>
                {batteryLevel}%
              </p>
              <div className="w-full bg-gray-700 rounded-full h-1 mt-1 overflow-hidden">
                <div 
                  className={`h-full transition-all duration-500 ${
                    batteryLevel > 60 ? 'bg-green-400' : 
                    batteryLevel > 30 ? 'bg-yellow-400' : 'bg-red-400'
                  }`}
                  style={{ width: `${batteryLevel}%` }}
                />
              </div>
            </div>
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default TrackingCard;
