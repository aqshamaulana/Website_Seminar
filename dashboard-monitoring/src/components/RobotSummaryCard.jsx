import React from 'react';
import { Power } from 'lucide-react';

const RobotSummaryCard = ({ name, image, status, runTime, type = 'UR' }) => {
  
  let isOnline = false;
  let statusText = "Offline";

  // Logika untuk menentukan status berdasarkan tipe robot
  if (type === 'UR') {
    isOnline = status; // Untuk UR, status adalah boolean true/false
    statusText = isOnline ? "Online" : "Offline";
  }

  // const formatRunTime = (minutes) => {
  //   if (isNaN(minutes)) return "0h 0m";
  //   const hrs = Math.floor(minutes / 60);
  //   const mins = minutes % 60;
  //   return `${hrs}h ${mins}m`;
  // };

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-4 border border-gray-700/50 flex flex-col items-center text-center transition-all duration-300 hover:bg-gray-800 hover:border-gray-600">
      <div className="w-24 h-24 mb-4 flex items-center justify-center">
        <img src={image} alt={name} className="max-w-full max-h-full object-contain" />
      </div>
      <h3 className="text-lg font-bold text-white truncate w-full">{name}</h3>
      
      <div className="w-full mt-4 pt-4 border-t border-gray-700 space-y-3">
        <div className="flex justify-between items-center text-sm">
          <span className="flex items-center gap-2 text-gray-400">
            <Power size={14} />
            Status
          </span>
          <span className={`font-semibold ${isOnline ? 'text-green-400' : 'text-red-400'}`}>
            {statusText}
          </span>
        </div>
        {/* <div className="flex justify-between items-center text-sm">
          <span className="flex items-center gap-2 text-gray-400">
            <Clock size={14} />
            Runtime
          </span>
          <span className="font-semibold text-white">
            {formatRunTime(runTime)}
          </span>
        </div> */}
      </div>
    </div>
  );
};

export default RobotSummaryCard;