// src/components/SingleURCard.jsx

import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import RobotUr from "../assets/RobotUR.png"; // Pastikan path gambar benar

// Sub-komponen kecil untuk setiap kotak status
export const StatusIndicator = ({ label, value, active, compact = false }) => {
    // Cukup tambahkan 'return' di sini
    return (
        <div className="p-3 rounded-lg bg-gray-700/50 border border-gray-600/50 text-center text-sm shadow-inner">
            <p className="font-semibold text-gray-300 mb-1 text-xs truncate">{label}</p>
            <p className={`text-base font-bold truncate ${active === undefined ? "text-blue-300" : active ? "text-green-400" : "text-red-400"}`}>
                {value}
            </p>
        </div>
    );
};

const CardURrobot = ({ title, subTitle, image, urData, currentHistory }) => {
    // const formatRunTime = (minutes) => {
    //     if (isNaN(minutes)) return "0h 0m";
    //     const hrs = Math.floor(minutes / 60);
    //     const mins = minutes % 60;
    //     return `${hrs}h ${mins}m`;
    // };

    return (
        <div className="bg-gray-900/70 backdrop-blur-sm rounded-3xl shadow-2xl p-6 md:p-8 text-gray-100 border border-gray-800">
            <div className="flex flex-col lg:flex-row gap-8">
                {/* Bagian Gambar & Status Utama */}
                <div className="lg:w-1/3 flex flex-col items-center text-center">
                    <img src={image || RobotUr} alt={title} className="w-48 lg:w-full max-w-xs object-contain mb-4" />
                    <header className='mb-4'>
                        <h2 className="text-4xl font-extrabold tracking-wide text-white">{title}</h2>
                        <p className="text-lg text-gray-400 mt-1">{subTitle}</p>
                    </header>
                    <div className={`px-4 py-2 rounded-full border ${urData.robotStatus ? "bg-green-500/10 border-green-400/30 text-green-300" : "bg-red-500/10 border-red-400/30 text-red-400"}`}>
                        <span className="font-semibold">{urData.robotStatus ? "Online & Running" : "Offline"}</span>
                    </div>
                </div>
                
                {/* Bagian Detail dan Grafik */}
                <div className="lg:w-2/3 space-y-6">
                    <section className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        <StatusIndicator label="Alarm Status" value={urData.alarmStatus ? "Active" : "Clear"} active={!urData.alarmStatus} />
                        <StatusIndicator label="Tool Status" value={urData.toolStatus ? "On" : "Off"} active={urData.toolStatus} />
                        <StatusIndicator label="Robot Current" value={`${urData.robotCurrent || 0} A`} />
                        {/* <StatusIndicator label="Run Time" value={formatRunTime(urData.runTime)} />
                        <StatusIndicator label="Cycle Count" value={urData.cycleCount || 0} /> */}
                    </section>

                    <div className="bg-gray-800/40 p-3 rounded-lg border border-gray-700/50">
                        <p className="text-xs text-gray-400 mb-1">Joint Degrees (°)</p>
                        <p className="text-sm font-mono text-blue-300 tracking-wider">
                            {urData.jointDegrees && urData.jointDegrees.length > 0 ? urData.jointDegrees.join(' | ') : 'N/A'}
                        </p>
                    </div>

                    <section className="bg-gray-800/40 rounded-xl p-4 shadow-inner border border-gray-700/50">
                        <h3 className="text-lg font-semibold mb-3 text-white">Robot Current (Live)</h3>
                        <div className="h-40">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={currentHistory} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                                    <XAxis dataKey="time" tick={{ fill: 'rgba(255 255 255 / 0.7)', fontSize: 10 }} tickLine={false} axisLine={false} />
                                    <YAxis tick={{ fill: 'rgba(255 255 255 / 0.7)', fontSize: 10 }} tickLine={false} axisLine={false} />
                                    <Tooltip 
                                      contentStyle={{ backgroundColor: 'rgba(30, 41, 59, 0.8)', border: '1px solid #475569', backdropFilter: 'blur(5px)' }} 
                                      labelStyle={{ color: '#cbd5e1' }}
                                    />
                                    <Line type="monotone" dataKey="current" name="Current (A)" stroke="#38bdf8" strokeWidth={2} dot={false} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default CardURrobot;