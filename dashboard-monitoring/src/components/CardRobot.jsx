import React from "react";
import kukaImg from "../assets/kuka.png";
import { PlayCircle, PauseCircle, BatteryCharging, AlertCircle, Cpu, Activity, Wifi } from "lucide-react";

const CardRobot = ({ robot, indicatorStatus, ledType, pageType, darkMode = false }) => {
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
    <div className="group relative overflow-hidden rounded-3xl shadow-2xl transition-all duration-500 hover:shadow-[0_20px_50px_rgba(8,_112,_184,_0.7)] hover:-translate-y-2">
      {/* Background Gradient */}
      <div className={`absolute inset-0 bg-gradient-to-br ${
        isAMR1 
          ? 'from-green-900/90 via-green-800/80 to-green-700/90' 
          : 'from-red-900/90 via-red-800/80 to-red-700/90'
      } opacity-90`}></div>
      
      {/* Animated Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className={`absolute inset-0 bg-gradient-to-tr ${
          isAMR1 ? 'from-green-400 to-transparent' : 'from-red-400 to-transparent'
        } animate-pulse`}></div>
      </div>

      {/* Content Container */}
      <div className="relative z-10 p-6">
        {/* Header */}
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold text-white mb-1 tracking-wide">
            {robot.robotId}
          </h2>
          <p className="text-gray-200 text-sm opacity-90">Autonomous Mobile Robot</p>
          
          {/* Status Badge */}
          <div className="inline-flex items-center gap-2 mt-3 px-4 py-2 bg-black/30 rounded-full">
            <Wifi className={`w-4 h-4 ${isMoving ? 'text-green-400 animate-pulse' : 'text-gray-400'}`} />
            <span className="text-sm text-gray-200">
              {isMoving ? 'Connected' : 'Standby'}
            </span>
          </div>
        </div>

        {/* Robot Image Container */}
        <div className="relative flex justify-center mb-6">
          {/* Glow Effect */}
          <div className={`absolute inset-0 flex items-center justify-center ${isMoving ? 'animate-pulse' : ''}`}>
            <div className={`w-48 h-48 rounded-full ${
              isAMR1 ? 'bg-green-500/20' : 'bg-red-500/20'
            } blur-3xl`}></div>
          </div>
          
          {/* Robot Image */}
          <div className="relative z-10">
            <img 
              src={kukaImg} 
              alt="Robot KUKA" 
              className={`w-48 h-48 object-contain transition-transform duration-700 ${
                isMoving ? 'animate-bounce' : ''
              } group-hover:scale-110`}
            />
            
            {/* Moving Indicator Ring */}
            {isMoving && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className={`w-56 h-56 rounded-full border-4 ${
                  isAMR1 ? 'border-green-400' : 'border-red-400'
                } animate-spin`} style={{ animationDuration: '3s' }}></div>
              </div>
            )}
          </div>
        </div>

        {/* LED Indicator */}
        <div className="flex justify-center items-center gap-3 mb-6">
          <div className="relative">
            <div className={`w-10 h-10 rounded-full ${statusLEDColor} shadow-lg`}></div>
            {currentLED === "ON" && (
              <>
                <div className={`absolute inset-0 w-10 h-10 rounded-full ${statusLEDColor} animate-ping`}></div>
                <div className={`absolute inset-1 w-8 h-8 rounded-full bg-white/30 blur-sm`}></div>
              </>
            )}
          </div>
          <div>
            <p className="text-xs text-gray-300">LED Status</p>
            <p className="text-lg font-semibold text-white">{statusLEDText}</p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3">
          {/* Status Card */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 transition-all hover:bg-white/20">
            <div className="flex items-center justify-between mb-2">
              {isMoving ? (
                <PlayCircle className="w-6 h-6 text-green-400" />
              ) : (
                <PauseCircle className="w-6 h-6 text-red-400" />
              )}
              <span className={`text-sm font-bold ${isMoving ? 'text-green-400' : 'text-red-400'}`}>
                {robot.status || "Unknown"}
              </span>
            </div>
            <p className="text-xs text-gray-300">Status</p>
          </div>

          {/* Battery Card */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 transition-all hover:bg-white/20">
            <div className="flex items-center justify-between mb-2">
              <BatteryCharging className={`w-6 h-6 ${getBatteryColor(batteryLevel)}`} />
              <span className={`text-sm font-bold ${getBatteryColor(batteryLevel)}`}>
                {batteryLevel}%
              </span>
            </div>
            <p className="text-xs text-gray-300 mb-1">Battery</p>
            {/* Battery Bar */}
            <div className="w-full bg-gray-700 rounded-full h-1.5 overflow-hidden">
              <div 
                className={`h-full transition-all duration-500 ${getBatteryBgColor(batteryLevel)}`}
                style={{ width: `${batteryLevel}%` }}
              ></div>
            </div>
          </div>

          {/* Runtime Card */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 transition-all hover:bg-white/20">
            <div className="flex items-center justify-between mb-2">
              <Activity className="w-6 h-6 text-blue-400" />
              <span className="text-sm font-bold text-white">
                {Math.floor((robot.runTime || 0) / 60)}h {(robot.runTime || 0) % 60}m
              </span>
            </div>
            <p className="text-xs text-gray-300">Runtime</p>
          </div>

          {/* Error Card */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 transition-all hover:bg-white/20">
            <div className="flex items-center justify-between mb-2">
              <AlertCircle className={`w-6 h-6 ${robot.errorMessage ? 'text-orange-400' : 'text-gray-400'}`} />
              <span className={`text-sm font-bold ${robot.errorMessage ? 'text-orange-400' : 'text-gray-400'}`}>
                {robot.errorMessage ? 'Error' : 'OK'}
              </span>
            </div>
            <p className="text-xs text-gray-300">System</p>
          </div>
        </div>

        {/* Bottom Status Bar */}
        <div className="mt-4 bg-black/30 rounded-xl p-3 backdrop-blur-sm border border-white/10">
          <div className="flex items-center justify-center gap-3">
            <Cpu className="w-5 h-5 text-purple-400" />
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${isMoving ? 'bg-green-400' : 'bg-gray-400'} animate-pulse`}></div>
              <span className="text-sm text-gray-200">
                System: {isMoving ? 'Processing Tasks' : 'Idle Mode'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Corner Elements */}
      <div className={`absolute top-0 left-0 w-20 h-20 bg-gradient-to-br ${
        isAMR1 ? 'from-green-400/20' : 'from-red-400/20'
      } to-transparent rounded-br-full`}></div>
      <div className={`absolute bottom-0 right-0 w-20 h-20 bg-gradient-to-tl ${
        isAMR1 ? 'from-green-400/20' : 'from-red-400/20'
      } to-transparent rounded-tl-full`}></div>
    </div>
  );
};

export default CardRobot;

