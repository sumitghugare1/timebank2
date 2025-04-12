import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { FiArrowDown, FiClock, FiUsers, FiLayers, FiCheck } from "react-icons/fi";

function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [skills, setSkills] = useState([]);
  const [showSidebar, setShowSidebar] = useState(true);
  const navigate = useNavigate();
  const skillsRef = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
      checkAdminStatus(token);
    }
    fetchSkills();
  }, []);

  const checkAdminStatus = async (token) => {
    try {
      const response = await fetch("http://localhost:5000/api/auth/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      setIsAdmin(data.isAdmin || false);
    } catch (error) {
      console.error("Error checking admin status:", error);
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
    localStorage.removeItem("adminToken");
    setIsLoggedIn(false);
    setIsAdmin(false);
    navigate("/login");
  };

  const scrollToSkills = () => {
    if (skillsRef.current) {
      skillsRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar
        isLoggedIn={isLoggedIn}
        handleLogout={handleLogout}
        showSidebar={showSidebar}
        setShowSidebar={setShowSidebar}
        isAdmin={isAdmin}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Navbar */}
        <Navbar
          isLoggedIn={isLoggedIn}
          showSidebar={showSidebar}
          setShowSidebar={setShowSidebar}
          isAdmin={isAdmin}
        />

        {/* Hero Section */}
        <div className="relative overflow-hidden">
          <div className="bg-gradient-to-br from-primary-600 via-primary-700 to-secondary-700 text-white py-20 px-6 sm:py-28 sm:px-12 lg:px-16">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-6">
                Welcome to{" "}
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-300 to-yellow-100">
                  Virtual Time Bank
                </span>
              </h2>
              
              <p className="text-lg md:text-xl leading-relaxed mb-10 text-primary-100 max-w-2xl mx-auto">
                Exchange your skills and earn time credits! Join our community of experts and learn from each other while building your network.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={scrollToSkills}
                  className="btn px-6 py-3 rounded-full bg-white text-primary-700 hover:bg-gray-100 font-semibold flex items-center justify-center gap-2 mx-auto sm:mx-0"
                >
                  Get Started <FiArrowDown className="ml-1 animate-bounce" />
                </button>
                
                {isAdmin && (
                  <button
                    onClick={() => navigate("/admin/dashboard")}
                    className="btn px-6 py-3 rounded-full bg-indigo-800 text-white hover:bg-indigo-900 font-semibold mx-auto sm:mx-0"
                  >
                    Admin Dashboard
                  </button>
                )}
              </div>
            </div>
          </div>
          
          {/* Features Section */}
          <div className="py-16 px-6 bg-white">
            <div className="max-w-7xl mx-auto">
              <h3 className="text-3xl font-bold text-gray-800 mb-12 text-center">
                How It Works
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                <FeatureCard 
                  icon={<FiUsers />}
                  title="Share Your Skills"
                  description="Add your expertise to the platform and help others learn from your knowledge."
                />
                <FeatureCard 
                  icon={<FiClock />}
                  title="Earn Time Credits"
                  description="Get rewarded with time credits when you share your skills with the community."
                />
                <FeatureCard 
                  icon={<FiLayers />}
                  title="Learn New Skills"
                  description="Spend your earned credits to learn from experts in other domains."
                />
              </div>
            </div>
          </div>
        </div>

        {/* Available Skills Section */}
        <div ref={skillsRef} className="py-16 px-6 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <h3 className="text-3xl font-bold text-gray-800 mb-12 text-center">
              Available Skills
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {skills.length > 0 ? (
                skills.map((skill) => (
                  <div
                    key={skill._id}
                    className="card card-hover cursor-pointer shadow-lg rounded-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:scale-105"
                    onClick={() => navigate(`/course/${skill._id}`)}
                  >
                    {skill.thumbnail ? (
                      <img 
                        src={skill.thumbnail} 
                        alt={skill.name}
                        className="h-48 w-full object-cover"
                      />
                    ) : (
                      <div className="h-48 bg-gradient-to-br from-primary-500 to-secondary-600 rounded-t-lg flex items-center justify-center text-white text-5xl font-bold">
                        {skill.name?.charAt(0) || "?"}
                      </div>
                    )}
                    <div className="p-5">
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="text-xl font-bold text-gray-800">{skill.name}</h4>
                        <span className="bg-primary-100 text-primary-700 px-2 py-1 rounded-full text-sm font-medium">
                          {skill.timeCreditValue} Credits
                        </span>
                      </div>
                      <p className="text-gray-500 line-clamp-2 mb-3">
                        {skill.description || "No description available"}
                      </p>
                      <div className="flex items-center text-sm text-gray-600 pt-2 border-t">
                        <span className="flex-shrink-0 mr-1.5 rounded-full overflow-hidden bg-gray-100 h-8 w-8 flex items-center justify-center">
                          {skill.user?.name?.charAt(0) || "?"}
                        </span>
                        <span>By {skill.user?.name || "Unknown"}</span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center col-span-3 py-10">
                  No skills available yet. Be the first to add one!
                </p>
              )}
            </div>
            
            {skills.length > 0 && (
              <div className="mt-12 text-center">
                <button 
                  onClick={() => navigate("/explore")}
                  className="btn btn-primary px-8 py-3"
                >
                  Explore All Skills
                </button>
              </div>
            )}
          </div>
        </div>
        
        {/* CTA Section */}
        <div className="bg-primary-700 text-white py-16 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h3 className="text-3xl font-bold mb-6">Ready to Join Our Community?</h3>
            <p className="text-lg text-primary-100 mb-8">
              Create your account today and start exchanging knowledge with experts from around the world.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate("/signup")}
                className="btn px-8 py-3 bg-white text-primary-700 hover:bg-gray-100"
              >
                Sign Up Now
              </button>
              <button
                onClick={() => navigate("/login")}
                className="btn px-8 py-3 bg-transparent border border-white text-white hover:bg-primary-600"
              >
                Login
              </button>
            </div>
          </div>
        </div>
        
        {/* Footer */}
        <footer className="bg-gray-800 text-gray-300 py-8 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="mb-6 md:mb-0">
                <h4 className="text-xl font-bold text-white mb-2">Virtual Time Bank</h4>
                <p className="text-sm">Exchange skills, save time, grow together.</p>
              </div>
              <div className="text-sm">
                &copy; {new Date().getFullYear()} Virtual Time Bank. All rights reserved.
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

// Helper component for feature cards
const FeatureCard = ({ icon, title, description }) => {
  return (
    <div className="flex flex-col items-center text-center p-6 rounded-xl bg-gray-50 border border-gray-100">
      <div className="w-16 h-16 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center mb-6 text-3xl">
        {icon}
      </div>
      <h4 className="text-xl font-bold text-gray-800 mb-3">{title}</h4>
      <p className="text-gray-600">{description}</p>
    </div>
  );
};

export default Home;
