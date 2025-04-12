import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { FiLock, FiMail } from "react-icons/fi";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if already logged in as admin
    const token = localStorage.getItem("adminToken");
    if (token) {
      navigate("/admin/dashboard");
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      console.log("Attempting admin login...");
      const res = await axios.post("http://localhost:5000/api/auth/login", { email, password });
      
      console.log("Login response:", res.data);
      
      if (res.data.token) {
        // Verify if user is admin
        localStorage.setItem("token", res.data.token); // Store temporarily
        
        try {
          console.log("Checking admin status...");
          const profileRes = await axios.get("http://localhost:5000/api/auth/profile", {
            headers: { Authorization: `Bearer ${res.data.token}` },
          });
          
          console.log("Profile data:", profileRes.data);
          
          if (profileRes.data.isAdmin) {
            localStorage.setItem("adminToken", res.data.token);
            toast.success("Admin login successful!");
            navigate("/admin/dashboard");
          } else {
            localStorage.removeItem("token");
            toast.error("Access denied. Admin privileges required.");
          }
        } catch (profileError) {
          console.error("Error fetching profile:", profileError);
          localStorage.removeItem("token");
          toast.error("Failed to verify admin status.");
        }
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error(error.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Admin Login</h1>
          <p className="text-gray-600">Virtual Time Bank Management</p>
        </div>
        
        <form onSubmit={handleLogin} className="space-y-6">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
              <FiMail />
            </div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email Address"
              required
              className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
              <FiLock />
            </div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
              className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            {loading ? "Signing in..." : "Sign in as Admin"}
          </button>
        </form>
        
        <div className="mt-6 text-center">
          <button 
            onClick={() => navigate("/")}
            className="text-indigo-600 hover:text-indigo-800"
          >
            Return to Homepage
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
