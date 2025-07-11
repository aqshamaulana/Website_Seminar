import React from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import useURData from "../hooks/useURdata";
import useKukaLiveData from "../hooks/KukaData";
import CardURrobot, { StatusIndicator } from "../components/CardURrobot"; // Pastikan StatusIndicator juga diekspor dari CardURrobot
import MobileManipulatorImg from "../assets/cobot.png";
import UR30Img from "../assets/RobotUR.png";
import UR5e from "../assets/ur5e.png"

const URPage = () => {
    // Ambil semua data yang diperlukan dari hooks
    const { urData: ur30Data, currentHistory: ur30History } = useURData('ur30');
    const { urData: urCobotData, currentHistory: urCobotHistory } = useURData('urcobott');
    const { urData: ur5eData, currentHistory: ur5eHistory } = useURData('ur5e');
    const { robots } = useKukaLiveData("amr1", "led1", "ur");
    const kukaRobot = robots[1] || {}; // Data AMR 2

    const formatRunTime = (minutes) => {
        if (isNaN(minutes)) return "0h 0m";
        const hrs = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return `${hrs}h ${mins}m`;
    };

    return (
        <div className="space-y-8">

                      <div className="bg-gray-900/70 backdrop-blur-sm rounded-3xl shadow-2xl p-6 md:p-8 text-gray-100 border border-gray-800">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Kolom Kiri: Gambar */}
                    <div className="lg:w-1/3 flex justify-center items-center">
                        <img src={MobileManipulatorImg} alt="Mobile Manipulator" className="w-64 lg:w-full object-contain" />
                    </div>

                    {/* Kolom Kanan: Detail */}
                    <div className="lg:w-2/3 w-full space-y-6">
                        <header className="text-center lg:text-left">
                            <h2 className="text-4xl font-extrabold tracking-wide">AMR - Mobile Manipulator</h2>
                            <p className="text-lg text-gray-400 mt-1">KUKA AMR + UR5e Collaborative System</p>
                        </header>

                        {/* Grid untuk Status KUKA dan UR5e */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Sub-Kartu Status UR5e Manipulator */}
                            <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700/50 space-y-3">
                                <h3 className="text-lg font-semibold text-blue-300 flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-blue-400"></span>
                                    UR5e Manipulator
                                </h3>
                                <div className="grid grid-cols-2 gap-2">
                                    <StatusIndicator compact label="Status" value={urCobotData.robotStatus ? "Online" : "Offline"} active={urCobotData.robotStatus} />
                                    <StatusIndicator compact label="Alarm" value={urCobotData.alarmStatus ? "Active" : "Clear"} active={!urCobotData.alarmStatus} />
                                    <StatusIndicator compact label="Tool" value={urCobotData.toolStatus ? "On" : "Off"} active={urCobotData.toolStatus} />
                                    {/* <StatusIndicator compact label="Cycles" value={urCobotData.cycleCount || 0} /> */}
                                </div>
                                <div className="pt-2">
                                    <p className="text-xs text-gray-400">Joint Positions:</p>
                                    <p className="text-sm font-mono text-gray-200">
                                        {urCobotData.jointDegrees && urCobotData.jointDegrees.join(', ')}°
                                    </p>
                                </div>
                            </div>

                            {/* Sub-Kartu Status KUKA AMR Platform */}
                            <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700/50 space-y-3">
                                <h3 className="text-lg font-semibold text-orange-300 flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-orange-400"></span>
                                    KUKA AMR Platform
                                </h3>
                                <div className="grid grid-cols-2 gap-2">
                                    <StatusIndicator compact label="Status" value={kukaRobot.status || "Unknown"} />
                                    <StatusIndicator compact label="Battery" value={`${kukaRobot.batteryLevel || 0}%`} />
                                    <StatusIndicator compact label="Runtime" value={formatRunTime(kukaRobot.runTime)} />
                                    <StatusIndicator compact label="Error" value={kukaRobot.errorMessage || "None"} />
                                </div>
                                <div className="pt-2">
                                     <p className="text-xs text-gray-400 mb-1">Battery Level:</p>
                                     <div className="w-full bg-gray-700 rounded-full h-2.5">
                                        <div className="bg-green-500 h-2.5 rounded-full" style={{width: `${kukaRobot.batteryLevel || 0}%`}}></div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Grafik untuk Arus UR5e */}
                        <section className="bg-gray-800/50 rounded-xl p-4 shadow-inner border border-gray-700/50">
                            <div className="flex justify-between items-center mb-2">
                                <h3 className="text-lg font-semibold text-white">UR5e Current (A)</h3>
                                <span className="text-sm text-gray-400">Last: {urCobotData.robotCurrent || 0} A</span>
                            </div>
                            <div className="h-40">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={urCobotHistory} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                                        <XAxis dataKey="time" tick={{ fill: 'rgba(255 255 255 / 0.7)', fontSize: 10 }} axisLine={false} tickLine={false} />
                                        <YAxis tick={{ fill: 'rgba(255 255 255 / 0.7)', fontSize: 10 }} axisLine={false} tickLine={false}/>
                                        <Tooltip contentStyle={{ backgroundColor: 'rgba(30, 41, 59, 0.8)', border: '1px solid #475569' }} />
                                        <Line type="monotone" dataKey="current" name="Current (A)" stroke="#38bdf8" strokeWidth={2} dot={false} />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </section>
                    </div>
                </div>
            </div>

            {/* Kartu untuk UR30 (menggunakan komponen reusable) */}
            <CardURrobot
                title="UR30"
                subTitle="Assembly & Sorting Robot"
                urData={ur30Data}
                currentHistory={ur30History}
                image={UR30Img} 
            />

            {/* Kartu untuk UR5e (menggunakan komponen reusable) */}
            <CardURrobot
                title="UR5"
                subTitle="General Purpose Robot"
                urData={ur5eData}
                currentHistory={ur5eHistory}
                image={UR5e}
            />
        </div>
    );
};

export default URPage;