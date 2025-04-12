import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiLogOut, FiPlusCircle, FiSearch, FiUser, FiLayers, FiHome, FiCompass, FiGrid, FiList, FiFilter } from "react-icons/fi";
import AddCourseForm from "../components/AddCourseForm";
import CourseCard from "../components/CourseCard";

const Explore = () => {
  const [skills, setSkills] = useState([]);
  const [search, setSearch] = useState("");
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState("grid"); // grid or list view
  const [showAddForm, setShowAddForm] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    } else {
      fetchUserProfile(token);
      fetchSkills();
    }
  }, []);

  const fetchUserProfile = async (token) => {
    try {
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
    }
  };

  const fetchSkills = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("http://localhost:5000/api/skills");
      const data = await response.json();
      setSkills(data);
    } catch (error) {
      console.error("Error fetching skills:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddCourse = async (courseData) => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        alert("You are not logged in. Please log in to add a course.");
        return;
      }

      const response = await fetch("http://localhost:5000/api/skills", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(courseData),
      });

      if (response.ok) {
        alert("Course added successfully!");
        fetchSkills(); // Refresh the list of skills
      } else {
        const errorData = await response.json();
        console.error("Error response from server:", errorData);
        alert(errorData.message || "Failed to add course. Please try again.");
      }
    } catch (error) {
      console.error("Error adding course:", error);
      alert("An error occurred while adding the course. Please try again.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const filteredSkills = skills.filter((skill) => 
    skill.name.toLowerCase().includes(search.toLowerCase()) ||
    (skill.description && skill.description.toLowerCase().includes(search.toLowerCase())) ||
    (skill.tags && skill.tags.some(tag => tag.toLowerCase().includes(search.toLowerCase())))
  );

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="hidden md:block w-64 bg-white shadow-lg p-6 flex-shrink-0">
        <div className="flex items-center space-x-3 mb-10">
          <div className="bg-gradient-to-r from-purple-600 to-indigo-600 w-10 h-10 rounded-lg flex items-center justify-center text-white">
            <FiLayers className="text-xl" />
          </div>
          <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600">
            Virtual Time Bank
          </h1>
        </div>

        <nav className="space-y-2">
          <button 
            onClick={() => navigate("/")} 
            className="flex items-center w-full p-3 rounded-lg hover:bg-gray-100 transition-colors text-gray-700"
          >
            <FiHome className="mr-3 text-gray-500" /> Home
          </button>

          <button 
            onClick={() => navigate("/profile")} 
            className="flex items-center w-full p-3 rounded-lg hover:bg-gray-100 transition-colors text-gray-700"
          >
            <FiUser className="mr-3 text-gray-500" /> Profile
          </button>

          <button 
            className="flex items-center w-full p-3 rounded-lg bg-purple-50 text-purple-700 font-medium"
          >
            <FiCompass className="mr-3" /> Explore
          </button>

          <button
            onClick={() => navigate("/transactions")}
            className="flex items-center w-full p-3 rounded-lg hover:bg-gray-100 transition-colors text-gray-700"
          >
            <span className="mr-3 text-gray-500">📜</span> Transactions
          </button>
        </nav>

        <div className="mt-auto pt-6 border-t border-gray-100 mt-10">
          <button 
            onClick={handleLogout} 
            className="flex items-center w-full p-3 rounded-lg hover:bg-red-50 text-red-500 transition-colors"
          >
            <FiLogOut className="mr-3" /> Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Navbar */}
        <div className="bg-white shadow-sm sticky top-0 z-10">
          <div className="container mx-auto px-4 py-4 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center">
              <h2 className="text-2xl font-bold text-gray-800">Explore Skills</h2>
              <div className="hidden md:flex ml-8 space-x-2">
                <button 
                  onClick={() => setViewMode("grid")} 
                  className={`p-2 rounded-md ${viewMode === "grid" ? "bg-purple-100 text-purple-600" : "text-gray-500 hover:bg-gray-100"}`}
                >
                  <FiGrid />
                </button>
                <button 
                  onClick={() => setViewMode("list")} 
                  className={`p-2 rounded-md ${viewMode === "list" ? "bg-purple-100 text-purple-600" : "text-gray-500 hover:bg-gray-100"}`}
                >
                  <FiList />
                </button>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 flex-1 max-w-md">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="Search skills, tags, or keywords..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                {search && (
                  <button 
                    onClick={() => setSearch("")}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    ×
                  </button>
                )}
              </div>
            </div>
            
            {user && (
              <div className="flex items-center space-x-4">
                <div className="bg-gray-100 px-4 py-2 rounded-lg flex items-center">
                  <span className="font-medium text-gray-700 mr-2">{user.timeCredits}</span>
                  <span className="text-gray-600 text-sm">Credits</span>
                </div>
                <div className="bg-purple-100 h-8 w-8 rounded-full flex items-center justify-center text-purple-700 font-semibold">
                  {user.name?.charAt(0) || "?"}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-lg text-gray-500">Discover and learn new skills</h3>
              <p className="text-sm text-gray-500 mt-1">
                {filteredSkills.length} {filteredSkills.length === 1 ? 'skill' : 'skills'} available
              </p>
            </div>
            
            <button 
              onClick={() => setShowAddForm(!showAddForm)} 
              className="flex items-center bg-gradient-to-r from-purple-600 to-purple-800 text-white px-4 py-2 rounded-lg hover:from-purple-700 hover:to-purple-900 transition-all duration-300 shadow-md"
            >
              <FiPlusCircle className="mr-2" /> 
              {showAddForm ? "Hide Form" : "Add New Skill"}
            </button>
          </div>

          {/* Add New Course Form - Collapsible */}
          {showAddForm && (
            <div className="bg-white shadow-lg rounded-lg p-6 mb-8 border-l-4 border-purple-500 animate-fadeIn">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Share Your Skill</h3>
              <AddCourseForm onAddCourse={handleAddCourse} />
            </div>
          )}

          {/* Loading State */}
          {isLoading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
            </div>
          ) : filteredSkills.length > 0 ? (
            <div className={`
              ${viewMode === "grid" ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" : "space-y-4"}
            `}>
              {filteredSkills.map((skill) => (
                <div
                  key={skill._id}
                  onClick={() => navigate(`/course/${skill._id}`)}
                  className={`
                    ${viewMode === "list" ? "flex items-center bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer border border-gray-100" : ""}
                  `}
                >
                  {viewMode === "list" ? (
                    <>
                      <div className="w-24 h-24 flex-shrink-0">
                        {skill.thumbnail ? (
                          <img
                            src={skill.thumbnail}
                            alt={skill.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
                            <span className="text-2xl font-bold text-white">{skill.name.charAt(0)}</span>
                          </div>
                        )}
                      </div>
                      <div className="flex-1 p-4">
                        <div className="flex justify-between">
                          <h4 className="font-semibold text-gray-800">{skill.name}</h4>
                          <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded-full text-xs font-medium">
                            {skill.timeCreditValue} credits
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 line-clamp-1 mt-1">{skill.description}</p>
                      </div>
                    </>
                  ) : (
                    <CourseCard course={skill} />
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-lg shadow-sm">
              <div className="text-gray-400 mb-4">
                <svg className="mx-auto h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <p className="text-gray-500 text-lg">No matching skills found</p>
              <p className="text-gray-400 mt-2">Try adjusting your search or add a new skill</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Explore;
