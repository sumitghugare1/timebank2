import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { 
  FiHome, FiUsers, FiPackage, FiDollarSign, 
  FiSettings, FiLogOut, FiBarChart2 
} from "react-icons/fi";

const AdminSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const isActive = (path) => {
    return location.pathname === path ? "bg-indigo-700" : "";
  };

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    navigate("/admin/login");
  };

  return (
    <div className="bg-indigo-800 text-white w-64 min-h-screen p-4">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <p className="text-indigo-200 text-sm">Virtual Time Bank</p>
      </div>
      
      <nav className="space-y-2">
        <Link 
          to="/admin/dashboard" 
          className={`flex items-center gap-3 p-3 rounded-lg hover:bg-indigo-700 transition ${isActive('/admin/dashboard')}`}
        >
          <FiBarChart2 size={18} />
          <span>Dashboard</span>
        </Link>
        
        <Link 
          to="/admin/users" 
          className={`flex items-center gap-3 p-3 rounded-lg hover:bg-indigo-700 transition ${isActive('/admin/users')}`}
        >
          <FiUsers size={18} />
          <span>Users</span>
        </Link>
        
        <Link 
          to="/admin/skills" 
          className={`flex items-center gap-3 p-3 rounded-lg hover:bg-indigo-700 transition ${isActive('/admin/skills')}`}
        >
          <FiPackage size={18} />
          <span>Skills</span>
        </Link>
        
        <Link 
          to="/admin/transactions" 
          className={`flex items-center gap-3 p-3 rounded-lg hover:bg-indigo-700 transition ${isActive('/admin/transactions')}`}
        >
          <FiDollarSign size={18} />
          <span>Transactions</span>
        </Link>
        
        <Link 
          to="/admin/settings" 
          className={`flex items-center gap-3 p-3 rounded-lg hover:bg-indigo-700 transition ${isActive('/admin/settings')}`}
        >
          <FiSettings size={18} />
          <span>Settings</span>
        </Link>
        
        <hr className="border-indigo-700 my-4" />
        
        <Link 
          to="/" 
          className="flex items-center gap-3 p-3 rounded-lg hover:bg-indigo-700 transition"
        >
          <FiHome size={18} />
          <span>Visit Site</span>
        </Link>
        
        <button 
          onClick={handleLogout}
          className="flex items-center gap-3 p-3 rounded-lg hover:bg-indigo-700 transition w-full text-left"
        >
          <FiLogOut size={18} />
          <span>Logout</span>
        </button>
      </nav>
    </div>
  );
};

export default AdminSidebar;
