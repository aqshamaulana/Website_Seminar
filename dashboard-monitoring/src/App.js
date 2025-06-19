import React, { useState } from "react";
import Sidebar from "./layout/SideBar";
import Header from "./layout/Header";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import WHPage from "./pages/WHPage";
import UserPage from "./pages/UserPage";
import URPage from "./pages/URPage";
import HistoryPage from "./pages/HistoryPage";
import HomePage from "./pages/HomePage";
import AdminPage from "./pages/AdminPage";
import TrackingPage from "./pages/TrackingPage";

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <Router>
      <div className="flex">
        <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
        <div className={`transition-all duration-300 flex-1 ${isSidebarOpen ? "ml-64" : "ml-20"}`}>
          <Header />
          <div className="p-6">
            <Routes>
              <Route
                path="/"
                element={
                  <>
                    <h2 className="text-2xl font-bold mb-4">Selamat datang di Monitoring Robot</h2>
                    <HomePage></HomePage>
                  </>
                }
              />
              <Route path="/home" element={<HomePage />} />
              <Route path="/wh" element={<WHPage />} />
              <Route path="/user" element={<UserPage />} />
              <Route path="/ur" element={<URPage />} />
              <Route path="/history" element={<HistoryPage />} />
              <Route path="/admin" element={<AdminPage />} />
              <Route path="/tracking" element={<TrackingPage/>} />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;
