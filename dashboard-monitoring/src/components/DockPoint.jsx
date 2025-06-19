import React from "react";
import { Package, CheckCircle } from "lucide-react";

const DockPoint = ({ dockNumber, isActive, isPassed, colors }) => {
  return (
    <div className="flex flex-col items-center">
      {/* Dock Icon */}
      <div className="relative">
        {/* Glow effect for active dock */}
        {isActive && (
          <div className={`absolute inset-0 w-16 h-16 ${colors.bg} rounded-full blur-xl opacity-50 animate-pulse`}></div>
        )}
        
        {/* Main dock circle */}
        <div className={`relative w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 ${
          isActive 
            ? `${colors.bg} ${colors.glow} shadow-lg` 
            : isPassed 
              ? `${colors.bgLight} border-2 ${colors.border}` 
              : 'bg-gray-800 border-2 border-gray-700'
        }`}>
          {isActive ? (
            <Package className="w-6 h-6 text-white" />
          ) : isPassed ? (
            <CheckCircle className={`w-6 h-6 ${colors.text}`} />
          ) : (
            <span className="text-gray-400 font-semibold">{dockNumber}</span>
          )}
        </div>
      </div>

      {/* Dock Label */}
      <p className={`mt-2 text-sm font-medium ${
        isActive || isPassed ? 'text-white' : 'text-gray-500'
      }`}>
        Dock {dockNumber}
      </p>

      {/* Status text */}
      {isActive && (
        <p className={`text-xs ${colors.text} mt-1`}>Current</p>
      )}
    </div>
  );
};

export default DockPoint;
