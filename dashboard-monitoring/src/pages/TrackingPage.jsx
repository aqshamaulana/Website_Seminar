import React from "react";
import { useFlowStatus } from "../hooks/useFlowStatus";
import TrackingCard from "../components/TrackingCard";
import { AMR1_LABELS, AMR2_LABELS } from '../config/robotConfig';
import { getCurrentDockInfo } from "../config/robotConfig";


const TrackingPage = () => {
  const statusAmr1 = useFlowStatus("/statusAmr1"); // Data untuk 3 dok
  const statusAmr2 = useFlowStatus("/statusAmr2"); // Data untuk 4 dok

  // const getCurrentDockInfo = (status, labels) => {
  //   const dockIndex = status.findIndex((val) => val === 1);
  //   const activeLabel = labels[dockIndex]; // Ambil label kustom berdasarkan indeks

  //   return {
  //     dockNumber: dockIndex !== -1 ? dockIndex + 1 : null,
  //     // Buat pesan baru menggunakan label kustom
  //     message: dockIndex !== -1
  //       ? `Saat ini :  ${activeLabel}`
  //       : "Menunggu aktivitas...",
  //     isActive: dockIndex !== -1
  //   };
  // };

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold text-white">AMR Tracking</h1>
        <p className="text-gray-400 mt-1">Real-Time Monitoring of AMR movement.</p>
      </header>

      {/* 4. Tampilkan kartu dengan data dan label yang sesuai */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        
        {/* Kartu untuk AMR 1 */}
        <TrackingCard
          title="AMR 1 - Manipulator Robot"
          status={statusAmr1}
          dockInfo={getCurrentDockInfo(statusAmr1, AMR1_LABELS)}
          accentColor="green"
          dockLabels={AMR1_LABELS} // <-- Teruskan label kustom
        />
        
        {/* Kartu untuk AMR 2 */}
        <TrackingCard
          title="AMR 2"
          status={statusAmr2}
          dockInfo={getCurrentDockInfo(statusAmr2, AMR2_LABELS)}
          accentColor="red"
          dockLabels={AMR2_LABELS} // <-- Teruskan label kustom
        />

      </div>
    </div>
  );
};

export default TrackingPage;