import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Outlet } from "react-router-dom";
import Sidebar from "./layout/SideBar";
import Header from "./layout/Header";
import WHPage from "./pages/WHPage";
import UserPage from "./pages/UserPage";
import URPage from "./pages/URPage";
import HistoryPage from "./pages/HistoryPage";
import HomePage from "./pages/HomePage";
import AdminPage from "./pages/AdminPage";
import TrackingPage from "./pages/TrackingPage";

// Komponen Layout yang sudah diperbaiki untuk Fixed Sidebar
const AppLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    // Pembungkus ini tidak perlu 'flex' lagi
    <div className="bg-[#1E2433] min-h-screen">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      <div className={`transition-all duration-300 ${isSidebarOpen ? "lg:ml-80" : "lg:ml-20"}`}>
        <Header onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} />
        <main className="p-4 sm:p-6 lg:p-8">
          <Outlet /> {/* Halaman akan dirender di sini */}
        </main>
      </div>
      
    </div>
  );
};


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AppLayout />}>
          {/* Rute-rute ini akan dirender di dalam <Outlet /> */}
          <Route index element={<HomePage />} />
          <Route path="home" element={<HomePage />} />
          <Route path="wh" element={<WHPage />} />
          <Route path="user" element={<UserPage />} />
          <Route path="ur" element={<URPage />} />
          <Route path="history" element={<HistoryPage />} />
          <Route path="admin" element={<AdminPage />} />
          <Route path="tracking" element={<TrackingPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;