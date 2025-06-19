import React, { useState } from "react";
import Sidebar from "./SideBar"; // Pastikan path ini benar
import Header from "./Header";   // Pastikan path ini benar

const Layout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  
  return (
    <div className="bg-[#1E2433] min-h-screen">
      {/* Sidebar tetap fixed dan akan menumpuk di atas konten pada layar kecil */}
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      {/* PERBAIKAN KUNCI: Margin kiri hanya diterapkan pada layar besar (lg).
        Di layar kecil (di bawah lg), tidak ada margin, sehingga konten mengisi seluruh layar.
        Ini sesuai dengan pola di mana sidebar menjadi 'overlay' pada mobile.
      */}
      <div
        className={`transition-all duration-500 ease-out ${
          isSidebarOpen ? "lg:ml-80" : "lg:ml-24"
        }`}
      >
        <Header onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} />
        <main className="p-4 sm:p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
