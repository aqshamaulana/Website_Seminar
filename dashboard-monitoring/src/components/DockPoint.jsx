import React from "react";
import { Check,  MapPin } from "lucide-react";

const DockPoint = ({ dockNumber, label, isActive, isPassed, colors }) => {
  return (
    <div className="relative flex flex-col items-center group w-24">
      {/* Dock Icon & Ring */}
      <div className={`relative w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 border-2
        ${isActive
          ? `${colors.bg} ${colors.borderStrong} shadow-lg`
          : isPassed
            ? `${colors.bgLight} ${colors.border}`
            : 'bg-gray-800 border-gray-700'
        }`}
      >
        {/* Outer pulse ring for active state */}
        {isActive && (
          <div className={`absolute w-full h-full rounded-full ${colors.bg} animate-ping`}></div>
        )}

        {/* Inner Icon */}
        <div className="relative z-10">
          {isPassed ? (
            <Check className={`w-6 h-6 ${colors.textStrong}`} />
          ) : (
            <MapPin className={`w-6 h-6 ${isActive ? 'text-white' : 'text-gray-500'}`} />
          )}
        </div>
      </div>

      {/* Dock Label */}
      <div className="mt-3 text-center">
        <p className="text-xs text-gray-400">Step {dockNumber}</p>
        <p className={`font-semibold text-sm break-words transition-colors
          ${isActive || isPassed ? 'text-white' : 'text-gray-500'}`}
        >
          {label}
        </p>
      </div>
    </div>
  );
};

export default DockPoint;