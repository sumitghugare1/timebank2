import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { FiPlusCircle, FiSearch, FiClock, FiTrendingUp, FiBook } from "react-icons/fi";

function Dashboard() {
  const [user, setUser] = useState(null);
  const [skills, setSkills] = useState([]);
  const [search, setSearch] = useState("");
  const [showSidebar, setShowSidebar] = useState(true);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    } else {
      fetchUserProfile(token);
      fetchSkills();
    }
  }, [navigate]);

  const fetchUserProfile = async (token) => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:5000/api/auth/profile", {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (response.ok) {
        setUser(data);
      } else {
        alert("Session expired! Please log in again.");
        localStorage.removeItem("token");
        navigate("/login");
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSkills = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/skills");
      const data = await response.json();
      setSkills(data);
    } catch (error) {
      console.error("Error fetching skills:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };
  
  // Filter skills based on search query
  const filteredSkills = skills.filter((skill) =>
    skill.name.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar
        isLoggedIn={true}
        handleLogout={handleLogout}
        showSidebar={showSidebar}
        setShowSidebar={setShowSidebar}
      />

      {/* Main Content */}
      <div className="flex-1">
        {/* Navbar */}
        <Navbar
          isLoggedIn={true}
          showSidebar={showSidebar}
          setShowSidebar={setShowSidebar}
        />

        <div className="p-6 md:p-8">
          {/* Welcome Section with Stats */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">
              Welcome, {user?.name || "User"}!
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="card bg-gradient-to-r from-primary-500 to-primary-600 text-white">
                <div className="flex items-center">
                  <div className="p-3 bg-white/20 rounded-lg mr-4">
                    <FiClock className="h-8 w-8" />
                  </div>
                  <div>
                    <p className="text-primary-100 text-sm">Time Credits</p>
                    <h3 className="text-2xl font-bold">{user?.timeCredits || 0}</h3>
                  </div>
                </div>
              </div>
              
              <div className="card bg-gradient-to-r from-secondary-500 to-secondary-600 text-white">
                <div className="flex items-center">
                  <div className="p-3 bg-white/20 rounded-lg mr-4">
                    <FiBook className="h-8 w-8" />
                  </div>
                  <div>
                    <p className="text-secondary-100 text-sm">Your Skills</p>
                    <h3 className="text-2xl font-bold">{user?.skills?.length || 0}</h3>
                  </div>
                </div>
              </div>
              
              <div className="card bg-gradient-to-r from-indigo-500 to-indigo-600 text-white">
                <div className="flex items-center">
                  <div className="p-3 bg-white/20 rounded-lg mr-4">
                    <FiTrendingUp className="h-8 w-8" />
                  </div>
                  <div>
                    <p className="text-indigo-100 text-sm">Available Skills</p>
                    <h3 className="text-2xl font-bold">{skills.length}</h3>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Add Courses Section */}
          <div
            className="card card-hover cursor-pointer mb-8 border-2 border-dashed border-primary-300 bg-primary-50 flex items-center justify-center"
            onClick={() => navigate("/explore")}
          >
            <div className="p-8 text-center">
              <div className="mx-auto h-16 w-16 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center mb-4">
                <FiPlusCircle className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold text-primary-700 mb-2">
                Add New Courses
              </h3>
              <p className="text-primary-600">
                Click here to explore and add new courses to the platform.
              </p>
            </div>
          </div>

          {/* Skills & Search Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Your Skills Section */}
            <div className="card">
              <h3 className="text-xl font-bold text-gray-800 flex items-center mb-4">
                <FiBook className="mr-2" /> Your Skills
              </h3>
              
              {user?.skills && user.skills.length > 0 ? (
                <div className="space-y-3">
                  {user.skills.map((skill) => (
                    <div key={skill._id} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="flex justify-between items-center">
                        <h4 className="font-medium">{skill.name}</h4>
                        <span className="px-2 py-1 bg-primary-100 text-primary-700 text-xs rounded-full">
                          {skill.hoursAvailable} hours
                        </span>
                      </div>
                      <p className="text-gray-600 text-sm mt-1 line-clamp-1">
                        {skill.description || "No description"}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 bg-gray-50 rounded-lg">
                  <p className="text-gray-500 mb-4">No skills added yet.</p>
                  <button 
                    onClick={() => navigate("/add-skill")}
                    className="btn btn-primary"
                  >
                    Add Your First Skill
                  </button>
                </div>
              )}
            </div>

            {/* Search Skills Section */}
            <div className="card">
              <h3 className="text-xl font-bold text-gray-800 flex items-center mb-4">
                <FiSearch className="mr-2" /> Search Skills
              </h3>
              <div className="mb-4 relative">
                <input
                  type="text"
                  placeholder="Search skills..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="input"
                />
                <FiSearch className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
              </div>
              
              <div className="space-y-2 max-h-80 overflow-y-auto">
                {filteredSkills.length > 0 ? (
                  filteredSkills.map((skill) => (
                    <div
                      key={skill._id}
                      className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition cursor-pointer"
                      onClick={() => navigate(`/skill/${skill._id}`)}
                    >
                      <div className="flex justify-between items-center">
                        <h4 className="font-medium">{skill.name}</h4>
                        <span className="px-2 py-1 bg-secondary-100 text-secondary-700 text-xs rounded-full">
                          {skill.timeCreditValue} credits
                        </span>
                      </div>
                      <p className="text-gray-600 text-sm mt-1 line-clamp-2">{skill.description}</p>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 bg-gray-50 rounded-lg">
                    <p className="text-gray-500">No matching skills found.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
