import React from "react";
import { useFlowStatus } from "../hooks/useFlowStatus";
import useKukaLiveData from "../hooks/KukaData";
import TrackingCard from "../components/TrackingCard";

const TrackingPage = () => {
  const statusAmr1 = useFlowStatus("/statusAmr1");
  const statusAmr2 = useFlowStatus("/statusAmr2");
  const { robots } = useKukaLiveData("amr1", "led1", "tracking");

  const robot1Data = robots[0] || { batteryLevel: "0", status: "unknown" };
  const robot2Data = robots[1] || { batteryLevel: "0", status: "unknown" };

  const getCurrentDockInfo = (status) => {
    const dockIndex = status.findIndex((val) => val === 1);
    return {
      dockNumber: dockIndex !== -1 ? dockIndex + 1 : null,
      message: dockIndex !== -1
        ? `Barang telah sampai di Dock ${dockIndex + 1}`
        : "Menunggu aktivitas...",
      isActive: dockIndex !== -1
    };
  };

  return (
    <div className="min-h-screen bg-dark-primary p-6">
      {/* Header */}
      {/* <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Tracking System</h1>
        <p className="text-gray-400">Monitor pergerakan AMR secara real-time</p>
      </div> */}

      {/* Main Content */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* AMR 1 */}
        <TrackingCard
          amrNumber={1}
          title="AMR 1 "
          status={statusAmr1}
          dockInfo={getCurrentDockInfo(statusAmr1)}
          accentColor="green"
          robotData={robot1Data}
        />
        
        {/* AMR 2 */}
        <TrackingCard
          amrNumber={2}
          title="AMR 2 - Manipulator Robot"
          status={statusAmr2}
          dockInfo={getCurrentDockInfo(statusAmr2)}
          accentColor="red"
          robotData={robot2Data}
        />
      </div>
    </div>
  );
};

export default TrackingPage;
