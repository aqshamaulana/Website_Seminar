import React from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import RobotUr from "../assets/RobotUR.png"
import MobileManipulatorImg from "../assets/cobot.png"; // Gunakan gambar mobile manipulator
import useURData from "../hooks/useURdata";
import useKukaLiveData from "../hooks/KukaData";

const URMonitoringCard = () => {
  const { urData, currentHistory } = useURData();
  const { robots } = useKukaLiveData("amr1", "led1", "user");
  
  // Status mapping untuk KUKA
  const statusMap = {
    online: "Online",
    offline: "Offline",
    error: "Error",
    maintenance: "Maintenance",
  };
  
  // Ambil robot pertama dari array robots dengan data yang sesuai
  const kukaRobotRaw = robots[0] || {};
  const kukaRobot = {
    robotId: kukaRobotRaw.robotId || "AMR 1",
    robotType: kukaRobotRaw.robotType || "KUKA",
    status: statusMap[kukaRobotRaw.status] || "Unknown",
    batteryLevel: Math.round((kukaRobotRaw.batteryLevel || 0) * 1),
    runTime: Math.round((kukaRobotRaw.runTime || 0) / 60),
    errorMessage: kukaRobotRaw.errorMessage || "No Error"
  };

  const formatRunTime = (minutes) => {
    const hrs = Math.floor(minutes / 60);  
    const mins = minutes % 60;
    return `${hrs}h ${mins}m`;
  };

  // REMOVED: Duplicate WebSocket connection - now using data from useURData hook

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* UR Robot Card */}
      <div className="bg-gray-900 rounded-3xl shadow-2xl p-6 text-gray-100">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Image Section for UR */}
          <div className="md:w-1/3 flex justify-center items-center">
            <img 
              src={RobotUr} 
              alt="UR30 Robot" 
              className="w-48 md:w-full object-contain rounded-xl shadow-lg"
              loading="lazy"
            />
          </div>

          {/* Content Section for UR */}
          <div className="md:w-2/3 flex flex-col justify-between gap-6">
            <header>
              <h1 className="text-4xl font-extrabold drop-shadow-lg tracking-wide">
                {urData.robotId} - Manipulator
              </h1>
              <p className="text-lg text-gray-400 mt-1">Universal Robot</p>
            </header>

            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <StatusIndicator 
                label="Robot Status" 
                value={urData.robotStatus ? "Online" : "Offline"} 
                active={urData.robotStatus} 
              />
              <StatusIndicator 
                label="Alarm Status" 
                value={urData.alarmStatus || "None"}
                active={urData.alarmStatus === "None"} 
              />
              <StatusIndicator label="Tool Status" value={urData.toolStatus} />
              <StatusIndicator 
                label="Joint Degrees" 
                value={urData.jointDegrees.map(d => `${d}°`).join(", ")} 
                fullWidth
              />
              <StatusIndicator label="Run Time" value={formatRunTime(urData.runTime)} />
              <StatusIndicator label="Cycle Count" value={urData.cycleCount} />
            </section>

            {/* Chart Section for UR */}
            <section className="bg-gray-800 rounded-xl p-4 shadow-inner">
              <h2 className="text-xl font-semibold mb-3 text-white">Robot Current (A)</h2>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={currentHistory}>
                    <XAxis 
                      dataKey="time" 
                      tick={{ fill: 'rgba(255 255 255 / 0.7)' }}
                      tickLine={false}
                      axisLine={{ stroke: "rgba(255 255 255 / 0.3)" }}
                      interval="preserveStartEnd"
                      minTickGap={20}
                    />
                    <YAxis 
                      tick={{ fill: 'rgba(255 255 255 / 0.7)' }} 
                      tickLine={false} 
                      axisLine={{ stroke: "rgba(255 255 255 / 0.3)" }} 
                      domain={['auto', 'auto']}
                    />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#1a202c', border: 'none' }} 
                      labelStyle={{ color: '#cbd5e1' }}
                      itemStyle={{ color: '#60a5fa' }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="current" 
                      stroke="#3b82f6" 
                      strokeWidth={3} 
                      dot={false} 
                      strokeLinecap="round"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </section>
          </div>
        </div>
      </div>

      {/* Combined Mobile Manipulator Card */}
      <div className="bg-gray-900 rounded-3xl shadow-2xl p-6 text-gray-100 mt-6">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Image Section */}
          <div className="md:w-1/3 flex justify-center items-center">
            <img 
              src={MobileManipulatorImg} 
              alt="Mobile Manipulator" 
              className="w-48 md:w-full object-contain rounded-xl shadow-lg"
              loading="lazy"
            />
          </div>

          {/* Content Section */}
          <div className="md:w-2/3 flex flex-col gap-6">
            <header>
              <h1 className="text-4xl font-extrabold drop-shadow-lg tracking-wide">
                AMR 1 - Mobile Manipulator
              </h1>
              <p className="text-lg text-gray-400 mt-1">KUKA AMR + UR5e Collaborative System</p>
            </header>

            {/* Combined Status Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* UR30 Status Section - Now using data from useURData hook */}
              <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
                <h3 className="text-xl font-semibold text-blue-300 mb-3 flex items-center">
                  <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse mr-2"></span>
                  UR5e Manipulator
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <StatusIndicator 
                    label="Status" 
                    value={urData.robotStatus ? "Online" : "Offline"} 
                    active={urData.robotStatus}
                    compact 
                  />
                  <StatusIndicator 
                    label="Alarm" 
                    value={urData.alarmStatus ? "Active" : "Clear"}
                    active={!urData.alarmStatus}
                    compact 
                  />
                  <StatusIndicator 
                    label="Tool" 
                    value={urData.toolStatus ? "Connected" : "Disconnected"}
                    active={urData.toolStatus}
                    compact
                  />
                  <StatusIndicator 
                    label="Cycles" 
                    value={urData.cycleCount || 0}
                    compact
                  />
                </div>
                <div className="mt-3 p-2 bg-gray-900/50 rounded">
                  <p className="text-xs text-gray-400">Joint Positions:</p>
                  <p className="text-sm text-gray-200">
                    {urData.jointDegrees && Array.isArray(urData.jointDegrees) 
                      ? urData.jointDegrees.map(d => `${d}°`).join(", ")
                      : "No data"
                    }
                  </p>
                </div>
              </div>

              {/* KUKA AMR Status Section */}
              <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
                <h3 className="text-xl font-semibold text-orange-300 mb-3 flex items-center">
                  <span className="w-2 h-2 rounded-full bg-orange-400 animate-pulse mr-2"></span>
                  KUKA AMR Platform
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <StatusIndicator 
                    label="Status" 
                    value={kukaRobot.status} 
                    active={kukaRobot.status === "Online"}
                    compact 
                  />
                  <StatusIndicator 
                    label="Battery" 
                    value={`${kukaRobot.batteryLevel}%`}
                    active={kukaRobot.batteryLevel > 20}
                    compact
                  />
                  <StatusIndicator 
                    label="Runtime" 
                    value={formatRunTime(kukaRobot.runTime)}
                    compact
                  />
                  <StatusIndicator 
                    label="Error" 
                    value={kukaRobot.errorMessage === "No Error" ? "None" : "Active"}
                    active={kukaRobot.errorMessage === "No Error"}
                    compact
                  />
                </div>
                {/* Battery Progress Bar */}
                <div className="mt-3">
                  <div className="w-full bg-gray-700 rounded-full h-4 overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-500 flex items-center justify-center text-xs font-semibold ${
                        kukaRobot.batteryLevel > 50 ? 'bg-green-500' : 
                        kukaRobot.batteryLevel > 20 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${kukaRobot.batteryLevel}%` }}
                    >
                      {kukaRobot.batteryLevel}%
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Current Chart Section - Now using data from useURData hook */}
            <section className="bg-gray-800 rounded-xl p-4 shadow-inner">
              <div className="flex justify-between items-center mb-3">
                <h2 className="text-lg font-semibold text-white">UR30 Current (A)</h2>
                <span className="text-sm text-gray-400">
                  Last: {urData.robotCurrent || 0} A
                </span>
              </div>
              <div className="h-40">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={currentHistory}>
                    <XAxis 
                      dataKey="time" 
                      tick={{ fill: 'rgba(255 255 255 / 0.7)', fontSize: 10 }}
                      tickLine={false}
                      axisLine={{ stroke: "rgba(255 255 255 / 0.3)" }}
                      interval="preserveStartEnd"
                      minTickGap={20}
                    />
                    <YAxis 
                      tick={{ fill: 'rgba(255 255 255 / 0.7)', fontSize: 10 }} 
                      tickLine={false} 
                      axisLine={{ stroke: "rgba(255 255 255 / 0.3)" }} 
                      domain={['auto', 'auto']}
                    />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#1a202c', border: 'none', fontSize: 12 }} 
                      labelStyle={{ color: '#cbd5e1' }}
                      itemStyle={{ color: '#60a5fa' }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="current" 
                      stroke="#3b82f6" 
                      strokeWidth={2} 
                      dot={false} 
                      strokeLinecap="round"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatusIndicator = ({ label, value, active, fullWidth = false, compact = false }) => {
  const getStatusColor = () => {
    if (active === undefined) return "text-blue-400";
    return active ? "text-green-400" : "text-red-400";
  };

  if (compact) {
    return (
      <div className="bg-gray-700/40 rounded-lg p-2 border border-gray-600">
        <p className="text-xs text-gray-400">{label}</p>
        <p className={`text-sm font-semibold ${getStatusColor()}`}>
          {value}
        </p>
      </div>
    );
  }

  return (
    <div className={`p-4 rounded-lg bg-gray-700/60 backdrop-blur-sm border border-gray-600 shadow-md 
      flex flex-col justify-center items-center text-center text-sm ${fullWidth ? "sm:col-span-2 lg:col-span-3" : ""}`}>
      <p className="font-bold text-white mb-2">{label}</p>
      <p className={`text-lg font-semibold ${getStatusColor()}`}>
        {value}
      </p>
    </div>
  );
};

export default URMonitoringCard;