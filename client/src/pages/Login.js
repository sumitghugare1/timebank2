import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { FiMail, FiLock, FiUser } from "react-icons/fi";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isAdminLogin, setIsAdminLogin] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Function to show toast notification
  const showToast = (message, type) => {
    toast[type](message, {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      theme: "colored",
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", { email, password });

      localStorage.setItem("token", res.data.token);
      
      // Check if this is an admin login attempt
      if (isAdminLogin) {
        // Check if user is admin
        const profileRes = await axios.get("http://localhost:5000/api/auth/profile", {
          headers: { Authorization: `Bearer ${res.data.token}` },
        });
        
        if (profileRes.data.isAdmin) {
          localStorage.setItem("adminToken", res.data.token);
          showToast("🔐 Admin login successful!", "success");
          setTimeout(() => navigate("/admin/dashboard"), 2000);
        } else {
          showToast("⚠️ Access denied. Admin privileges required.", "error");
        }
      } else {
        showToast("🎉 Welcome Back! You are successfully logged in.", "success");
        setTimeout(() => navigate("/dashboard"), 2000);
      }
    } catch (error) {
      showToast("⚠️ Invalid Credentials! Please try again.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-600 to-secondary-600 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-8">
        <div className="text-center mb-8">
          <div className="h-16 w-16 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <FiUser className="h-8 w-8" />
          </div>
          <h2 className="text-3xl font-bold text-gray-800">
            {isAdminLogin ? "Admin Login" : "Welcome Back"}
          </h2>
          <p className="text-gray-500 mt-2">
            {isAdminLogin 
              ? "Enter your admin credentials" 
              : "Enter your credentials to access your account"}
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label htmlFor="email" className="label">Email</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                <FiMail />
              </div>
              <input
                id="email"
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="input pl-10"
              />
            </div>
          </div>
          
          <div>
            <label htmlFor="password" className="label">Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                <FiLock />
              </div>
              <input
                id="password"
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="input pl-10"
              />
            </div>
          </div>
          
          <button
            type="submit"
            disabled={isLoading}
            className={`btn w-full ${
              isAdminLogin 
                ? "btn-secondary" 
                : "btn-primary"
            } ${isLoading ? "opacity-70 cursor-not-allowed" : ""}`}
          >
            {isLoading 
              ? "Logging in..." 
              : isAdminLogin 
                ? "Login as Admin" 
                : "Login"}
          </button>
        </form>

        <div className="mt-6">
          <button
            onClick={() => setIsAdminLogin(!isAdminLogin)}
            className="text-center w-full text-primary-600 hover:text-primary-800 text-sm font-medium"
          >
            {isAdminLogin 
              ? "Switch to User Login" 
              : "Login as Administrator"}
          </button>
        </div>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Don't have an account?{" "}
            <Link to="/signup" className="text-primary-600 font-semibold hover:text-primary-800">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
