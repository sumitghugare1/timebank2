import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  FiLogIn,
  FiUserPlus,
  FiHome,
  FiLayers,
  FiLogOut,
  FiCompass,
  FiSettings,
  FiUser,
  FiCreditCard
} from "react-icons/fi";

const Sidebar = ({ isLoggedIn, handleLogout, showSidebar, setShowSidebar, isAdmin }) => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const isActive = (path) => {
    return location.pathname === path;
  };
  
  if (!showSidebar) return null;

  return (
    <div className="min-h-screen bg-white shadow-lg w-64 flex flex-col transition-all duration-300 transform">
      <div className="p-5 border-b">
        <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-secondary-600">
          Virtual Time Bank
        </h2>
        <p className="text-sm text-gray-500 mt-1">Exchange skills, save time</p>
      </div>
      
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        <NavItem 
          icon={<FiHome />} 
          label="Home" 
          path="/" 
          isActive={isActive("/")} 
          onClick={() => navigate("/")}
        />
        
        {!isLoggedIn ? (
          <>
            <NavItem 
              icon={<FiLogIn />} 
              label="Login" 
              path="/login" 
              isActive={isActive("/login")} 
              onClick={() => navigate("/login")}
            />
            <NavItem 
              icon={<FiUserPlus />} 
              label="Sign Up" 
              path="/signup" 
              isActive={isActive("/signup")} 
              onClick={() => navigate("/signup")}
            />
          </>
        ) : (
          <>
            <NavItem 
              icon={<FiLayers />} 
              label="Dashboard" 
              path="/dashboard" 
              isActive={isActive("/dashboard")} 
              onClick={() => navigate("/dashboard")}
            />
            <NavItem 
              icon={<FiCompass />} 
              label="Explore" 
              path="/explore" 
              isActive={isActive("/explore")} 
              onClick={() => navigate("/explore")}
            />
            <NavItem 
              icon={<FiUser />} 
              label="Profile" 
              path="/profile" 
              isActive={isActive("/profile")} 
              onClick={() => navigate("/profile")}
            />
            <NavItem 
              icon={<FiCreditCard />} 
              label="Transaction History" 
              path="/transactions" 
              isActive={isActive("/transactions")} 
              onClick={() => navigate("/transactions")}
            />
            
            {isAdmin && (
              <NavItem 
                icon={<FiSettings />} 
                label="Admin Panel" 
                path="/admin/dashboard" 
                isActive={isActive("/admin/dashboard")} 
                onClick={() => navigate("/admin/dashboard")}
                className="bg-indigo-50 text-indigo-800"
              />
            )}
          </>
        )}
      </nav>
      
      {isLoggedIn && (
        <div className="p-4 border-t">
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-4 py-2 text-left text-red-600 hover:bg-red-50 rounded-md transition-colors"
          >
            <FiLogOut className="mr-3" /> Logout
          </button>
        </div>
      )}
    </div>
  );
};

// Helper component for nav items
const NavItem = ({ icon, label, isActive, onClick, className = "" }) => {
  return (
    <button
      onClick={onClick}
      className={`flex items-center w-full px-4 py-3 rounded-lg transition-colors ${
        isActive 
          ? "bg-primary-50 text-primary-700 font-medium" 
          : "text-gray-700 hover:bg-gray-50"
      } ${className}`}
    >
      <span className="mr-3">{icon}</span> {label}
    </button>
  );
};

export default Sidebar;