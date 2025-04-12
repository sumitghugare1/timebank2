import React, { useState, useEffect } from "react";

import { useNavigate } from "react-router-dom";
import { FiLogOut, FiUser, FiArrowLeft } from "react-icons/fi";

function Profile() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    } else {
      fetchUserProfile(token);
    }
  }, []);

  const fetchUserProfile = async (token) => {
    try {
      const response = await fetch("http://localhost:5000/api/auth/profile", {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      console.log("User Profile Data:", data); // Debugging log
      if (response.ok) {
        setUser(data);
      } else {
        alert("Session expired! Please log in again.");
        localStorage.removeItem("token");
        navigate("/login");
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg p-5 flex flex-col">
        <h2 className="text-2xl font-bold text-purple-700 mb-6 flex items-center">
          <FiUser className="mr-2" /> Profile
        </h2>
        <nav className="flex flex-col space-y-4">
          <button
            onClick={() => navigate("/dashboard")}
            className="flex items-center p-3 rounded-lg hover:bg-purple-100"
          >
            <FiArrowLeft className="mr-3" /> Back to Dashboard
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center p-3 rounded-lg text-red-500 hover:bg-red-100"
          >
            <FiLogOut className="mr-3" /> Logout
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col p-6">
        <h2 className="text-2xl font-semibold text-purple-700 mb-4">Profile</h2>
        {user ? (
          <div className="bg-white shadow-lg p-6 rounded-lg">
            <div className="flex items-center space-x-4">
              <FiUser className="text-4xl text-purple-600" />
              <h3 className="text-xl font-semibold">{user.name}</h3>
            </div>
            <p className="text-gray-600">Email: {user.email}</p>
            <div className="mt-4">
              <h4 className="text-lg font-bold text-purple-700">Skills</h4>
              <ul className="list-disc ml-6">
                {user.skills && user.skills.length > 0 ? (
                  user.skills.map((skill) => (
                    <li key={skill._id} className="text-gray-600">
                      {skill.name} ({skill.availableHours} hours)
                    </li>
                  ))
                ) : (
                  <p className="text-gray-500">No skills added yet.</p>
                )}
              </ul>
            </div>
          </div>
        ) : (
          <p className="text-center text-gray-500">Loading...</p>
        )}
      </div>
    </div>
  );
}

export default Profile;
