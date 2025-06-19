import { useState, useEffect } from 'react';
import io from 'socket.io-client';

const useDashboardData = () => {
  const [dashboardData, setDashboardData] = useState({
    stats: {
      totalBarang: 0,
      totalRequest: 0,
      activeRobots: 0
    },
    recentActivities: [],
    grafikData: []
  });

  useEffect(() => {
    const socket = io('http://localhost:3001');
  
    const fetchDashboardData = async () => {
      try {
        const response = await fetch('http://localhost:3001/dashboard');
        const data = await response.json();
        
        console.log('Dashboard Data Fetched:', data);
        
        setDashboardData({
          stats: {
            totalBarang: data.totalBarang,
            totalRequest: data.totalRequest,
            activeRobots: data.activeRobots
          },
          recentActivities: data.recentActivities,
          grafikData: data.grafikData
        });
      } catch (error) {
        console.error('Gagal mengambil data dashboard:', error);
      }
    };
  
    fetchDashboardData();
  
    socket.on('dashboard_update', (data) => {
      console.log('Socket Dashboard Update:', data);
      
      setDashboardData(prevState => ({
        ...prevState,
        stats: {
          totalBarang: data.totalBarang,
          totalRequest: data.totalRequest,
          activeRobots: data.activeRobots
        },
        recentActivities: data.recentActivities,
        grafikData: data.grafikData
      }));
    });
  
    // Cleanup
    return () => {
      socket.disconnect();
    };
  }, []);
  
  return dashboardData;
};

export default useDashboardData;
