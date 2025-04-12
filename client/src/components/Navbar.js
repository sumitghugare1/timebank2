import React from "react";
import { useNavigate } from "react-router-dom";
import { FiMenu, FiX } from "react-icons/fi";

const Navbar = ({ isLoggedIn, showSidebar, setShowSidebar, isAdmin }) => {
  const navigate = useNavigate();

  return (
    <div className="bg-white shadow-md sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowSidebar(!showSidebar)}
              className="p-2 rounded-md text-primary-600 hover:bg-primary-50 focus:outline-none"
              aria-label="Toggle sidebar"
            >
              {showSidebar ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
            <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-secondary-600">
              Virtual Time Bank
            </h2>
          </div>
          
          <div className="flex gap-3">
            {!isLoggedIn ? (
              <>
                <button
                  onClick={() => navigate("/login")}
                  className="btn btn-outline"
                >
                  Login
                </button>
                <button
                  onClick={() => navigate("/signup")}
                  className="btn btn-primary"
                >
                  Sign Up
                </button>
              </>
            ) : (
              <>
                {isAdmin && (
                  <button
                    onClick={() => navigate("/admin/dashboard")}
                    className="btn bg-indigo-700 hover:bg-indigo-800 text-white"
                  >
                    Admin Panel
                  </button>
                )}
                
                <button
                  onClick={() => navigate("/dashboard")}
                  className="btn btn-primary"
                >
                  Dashboard
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;