// src/components/TrackingCard.jsx (Desain Baru)

import React from "react";
import { Truck, MapPin } from "lucide-react";
import DockPoint from "./DockPoint";
import { getColorClasses } from "../utils/colorClasses";

const TrackingCard = ({ title, status, dockInfo, accentColor, dockLabels = [] }) => {
  const colors = getColorClasses(accentColor);
  const progressPercentage = dockInfo.dockNumber ? ((dockInfo.dockNumber - 1) / (status.length - 1)) * 100 : 0;

  return (
    <div className={`group relative bg-slate-900/50 backdrop-blur-xl rounded-2xl overflow-hidden border border-slate-700/50 hover:border-slate-600 transition-all duration-300`}>
      {/* Decorative Glow Effect */}
      <div className={`absolute -top-1/4 -left-1/4 w-1/2 h-1/2 ${colors.bg} rounded-full blur-3xl opacity-20 group-hover:opacity-30 transition-opacity duration-500`}></div>
      <div className={`absolute -bottom-1/4 -right-1/4 w-1/2 h-1/2 ${colors.bg} rounded-full blur-3xl opacity-10 group-hover:opacity-20 transition-opacity duration-500 animation-delay-2000`}></div>
      
      <div className="relative z-10">
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-xl ${colors.bgLight} border ${colors.border} shadow-inner`}>
                <Truck className={`w-6 h-6 ${colors.textStrong}`} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">{title}</h3>
                <p className="text-sm text-gray-400">Autonomous Mobile Robot</p>
              </div>
            </div>
            <div className={`text-xs font-semibold px-3 py-1 rounded-full border ${dockInfo.isActive ? `${colors.borderStrong} ${colors.bg} text-white` : 'border-gray-700 bg-gray-800 text-gray-400'}`}>
              {dockInfo.isActive ? 'In Transit' : 'Idle'}
            </div>
          </div>
        </div>

        {/* Tracking Visual */}
        <div className="p-6 md:p-8">
          <div className="relative flex items-center justify-between">
            {/* Progress Line */}
            <div className="absolute top-6 left-0 w-full h-1.5 bg-gray-800 rounded-full">
              <div 
                className={`h-full ${colors.bgGradient} rounded-full transition-all duration-1000 ease-out`}
                style={{ width: `${progressPercentage}%` }}
              />
            </div>

            {/* Dock Points rendered on top of the line */}
            {status.map((val, i) => (
              <DockPoint
                key={i}
                dockNumber={i + 1}
                label={dockLabels[i] || `Dock ${i + 1}`}
                isActive={val === 1}
                isPassed={dockInfo.dockNumber ? i < dockInfo.dockNumber - 1 : false}
                colors={colors}
              />
            ))}
          </div>
        </div>

        {/* Status Message */}
        <div className="px-6 pb-6">
          <div className={`p-4 rounded-xl ${colors.bgLight} border ${colors.border}`}>
            <div className="flex items-start gap-4">
              <MapPin className={`w-6 h-6 ${colors.textStrong} mt-0.5`} />
              <div className="flex-1">
                <p className="text-sm font-semibold text-white mb-1">Current Status </p>
                <p className={`text-base font-medium ${colors.text}`}>{dockInfo.message}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrackingCard;