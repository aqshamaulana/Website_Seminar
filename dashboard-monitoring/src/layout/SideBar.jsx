import React, { useState } from "react";
import { 
  Home, 
  LayoutDashboard, 
  Monitor, 
  Bot, 
  History, 
  UserCircle2,
  MailCheck,
  ChevronLeft,
  Activity
} from "lucide-react";
import { NavLink } from "react-router-dom";
import logoSSD from '../assets/ssd-logo.png'; 

const Sidebar = ({ isOpen, setIsOpen }) => {
  const [hoveredItem, setHoveredItem] = useState(null);

  const navItems = [
    { 
      icon: Home, 
      label: "Home", 
      to: "/home", 
      badge: null,
      description: "Dashboard Overview"
    },
    { 
      icon: LayoutDashboard, 
      label: "Warehouse", 
      to: "/wh", 
      badge: null,
      description: "Warehouse Management"
    },
    { 
      icon: Monitor, 
      label: "User", 
      to: "/user", 
      badge: null,
      description: "User Interface"
    },
    { 
      icon: Bot, 
      label: "UR Control", 
      to: "/ur", 
      badge: null,
      description: "Robot Control"
    },
    { 
      icon: History, 
      label: "History", 
      to: "/history", 
      badge: "New",
      description: "Activity Logs"
    },
    { 
      icon: MailCheck, 
      label: "Tracking", 
      to: "/tracking", 
      badge: "3",
      description: "Track Shipments"
    }
  ];

  return (
    <>
      {/* Modern Dark Sidebar with Glass Effect */}
      <aside 
        className={`fixed top-0 left-0 z-50 h-screen transition-all duration-500 ease-out
        ${isOpen ? "w-80" : "w-24"} 
        bg-gray-900/95 backdrop-blur-xl border-r border-gray-800 shadow-2xl`}
      >
        {/* Decorative gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-blue-900/10 via-transparent to-purple-900/10 pointer-events-none" />
        
        {/* Header */}
        <div className="relative p-6">
          <div className="flex items-center justify-between">
            <div className={`flex items-center gap-4 transition-all duration-500 ${!isOpen && 'justify-center'}`}>
              {/* Logo with animation */}
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl blur-lg opacity-20 group-hover:opacity-30 transition-opacity" />
                <div className="relative bg-gray-800 rounded-2xl p-3 shadow-lg border border-gray-700">
                  <img 
                    src={logoSSD} 
                    alt="SSD Logo" 
                    className={`${isOpen ? 'h-8 w-8' : 'h-6 w-6'} transition-all duration-500`}
                  />
                </div>
              </div>
              
              {/* Brand Name */}
              {isOpen && (
                <div className="overflow-hidden">
                  <h2 className="text-xl font-bold text-gray-100 tracking-tight">
                    SSD System
                  </h2>
                  <p className="text-xs text-gray-400 font-medium">
                    Smart Management
                  </p>
                </div>
              )}
            </div>
            
            {/* Toggle Button */}
            <button 
              onClick={() => setIsOpen(!isOpen)}
              className={`absolute -right-5 top-8 w-10 h-10 bg-gray-800 border border-gray-700 
                rounded-xl flex items-center justify-center text-gray-400 hover:text-gray-100 
                hover:shadow-lg transition-all duration-300 hover:scale-110
                ${!isOpen && 'rotate-180'}`}
            >
              <ChevronLeft size={18} />
            </button>
          </div>

          {/* Status Indicator */}
          {isOpen && (
            <div className="mt-6 p-4 bg-gray-800/50 rounded-xl border border-gray-700">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse" />
                  <div className="absolute inset-0 w-3 h-3 bg-green-400 rounded-full animate-ping" />
                </div>
                <span className="text-sm font-medium text-gray-300">System Online</span>
                <Activity size={16} className="text-green-400 ml-auto" />
              </div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className={`flex-1 ${isOpen ? 'px-4' : 'px-3'} py-2 overflow-y-auto overflow-x-hidden`}>
          <div className="space-y-1">
            {navItems.map((item, index) => (
              <NavItem 
                key={item.to}
                {...item}
                isOpen={isOpen}
                index={index}
                hoveredItem={hoveredItem}
                setHoveredItem={setHoveredItem}
              />
            ))}
          </div>
        </nav>

        {/* Profile Section */}
        <div className={`relative border-t border-gray-800 ${isOpen ? 'p-4' : 'p-3'}`}>
          <NavLink 
            to="/admin"
            className="group flex items-center gap-3 p-3 rounded-xl hover:bg-gray-800 
              transition-all duration-300"
          >
            {/* Avatar with gradient border */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 
                rounded-full blur opacity-0 group-hover:opacity-30 transition-opacity duration-300" />
              <div className="relative rounded-full bg-gradient-to-r from-blue-500 to-purple-500 p-[2px]">
                <div className="bg-gray-900 rounded-full p-1">
                  <UserCircle2 size={isOpen ? 32 : 24} className="text-gray-300" />
                </div>
              </div>
            </div>
            
            {isOpen && (
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-100">Admin User</p>
                <p className="text-xs text-gray-400">View Profile</p>
              </div>
            )}
          </NavLink>
        </div>
      </aside>

      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};

const NavItem = ({ icon: Icon, label, to, badge, description, isOpen, index, hoveredItem, setHoveredItem }) => {
  return (
    <NavLink
      to={to}
      onMouseEnter={() => setHoveredItem(index)}
      onMouseLeave={() => setHoveredItem(null)}
      className={({ isActive }) => `
        relative group flex items-center gap-3 
        ${isOpen ? 'px-3 py-2.5' : 'px-3 py-3 justify-center'}
        rounded-xl transition-all duration-300
        ${isActive 
          ? 'bg-gradient-to-r from-blue-900/50 to-purple-900/50 border border-blue-800/50' 
          : 'hover:bg-gray-800/50'
        }
      `}
    >
      {({ isActive }) => (
        <>
          {/* Active Indicator */}
          {isActive && (
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 
              bg-gradient-to-b from-blue-400 to-purple-400 rounded-r-full" 
            />
          )}

          {/* Icon */}
          <div className={`relative flex items-center justify-center ${isOpen ? 'w-10 h-10' : 'w-9 h-9'}
            rounded-lg transition-all duration-300 
            ${isActive 
              ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg' 
              : 'bg-gray-800 text-gray-400 group-hover:bg-gray-700 group-hover:text-gray-200'
            }`}
          >
            <Icon size={isOpen ? 20 : 18} />
            
            {/* Notification Badge on Icon */}
            {badge && !isOpen && (
              <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white 
                text-xs rounded-full flex items-center justify-center font-medium">
                {badge}
              </div>
            )}
          </div>

          {/* Label and Description */}
          {isOpen && (
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <p className={`text-sm font-medium transition-colors duration-300 
                  ${isActive ? 'text-gray-100' : 'text-gray-300 group-hover:text-gray-100'}`}>
                  {label}
                </p>
                
                {/* Badge */}
                {badge && (
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium
                    ${badge === 'New' 
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white' 
                      : 'bg-red-500 text-white'
                    }`}>
                    {badge}
                  </span>
                )}
              </div>
              
              {/* Description */}
              {hoveredItem === index && description && (
                <p className="text-xs text-gray-500 mt-0.5 animate-slideIn">
                  {description}
                </p>
              )}
            </div>
          )}

          {/* Tooltip for collapsed sidebar */}
          {!isOpen && hoveredItem === index && (
            <div className="absolute left-full ml-3 px-3 py-2 bg-gray-800 border border-gray-700 text-gray-100 
              text-sm rounded-lg whitespace-nowrap shadow-xl z-50
              before:content-[''] before:absolute before:right-full before:top-1/2 
              before:-translate-y-1/2 before:border-8 before:border-transparent 
              before:border-r-gray-800">
              <p className="font-medium">{label}</p>
              {description && (
                <p className="text-xs text-gray-400 mt-0.5">{description}</p>
              )}
            </div>
          )}
        </>
      )}
    </NavLink>
  );
};

export default Sidebar;

// Add to your global CSS
const globalStyles = `
@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-5px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-slideIn {
  animation: slideIn 0.2s ease-out;
}
`;
