import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import "react-toastify/dist/ReactToastify.css";

const CourseDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);

  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`https://tbbackend.vercel.app/api/courses/${id}`, {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to fetch course details.");
        }

        const data = await response.json();
        setCourse(data);
      } catch (error) {
        console.error("Error fetching course details:", error);
        toast.error(error.message || "An error occurred while fetching course details.");
        navigate("/explore");
      } finally {
        setLoading(false);
      }
    };

    fetchCourseDetails();
  }, [id, navigate]);

  const handlePurchase = async () => {
    setPurchasing(true);
    try {
      const token = localStorage.getItem("token");
      
      // First, create a transaction record
      const transactionResponse = await fetch(`https://tbbackend.vercel.app/api/transactions/spend`, {
        method: "POST",
        headers: { 
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ skillId: id })
      });

      if (!transactionResponse.ok) {
        const errorData = await transactionResponse.json();
        throw new Error(errorData.message || "Failed to process transaction");
      }

      // After successful transaction, process the course purchase
      const purchaseResponse = await fetch(`https://tbbackend.vercel.app/api/courses/${id}/purchase`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!purchaseResponse.ok) {
        const errorData = await purchaseResponse.json();
        throw new Error(errorData.message || "Failed to purchase course.");
      }

      const purchaseData = await purchaseResponse.json();
      toast.success(purchaseData.message || "Course purchased successfully!");
      
      // Redirect to transaction history so user can see their purchase
      setTimeout(() => navigate("/transactions"), 1500);
    } catch (error) {
      console.error("Error purchasing course:", error);
      toast.error(error.message || "An error occurred while purchasing the course.");
    } finally {
      setPurchasing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (!course) {
    return <div className="p-6 text-center text-red-500">Course not found.</div>;
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar
        isLoggedIn={true}
        handleLogout={() => {
          localStorage.removeItem("token");
          navigate("/login");
        }}
        showSidebar={showSidebar}
        setShowSidebar={setShowSidebar}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Navbar */}
        <Navbar
          isLoggedIn={true}
          showSidebar={showSidebar}
          setShowSidebar={setShowSidebar}
        />

        {/* Course Details Section */}
        <div className="p-6 max-w-4xl mx-auto">
          <div className="bg-white shadow-lg rounded-lg overflow-hidden">
            {/* Course Hero Section */}
            {course.thumbnail ? (
              <div className="relative h-64 md:h-80">
                <img 
                  src={course.thumbnail} 
                  alt={course.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
                  <div className="p-6 text-white">
                    <h2 className="text-3xl font-bold mb-2">{course.name}</h2>
                    {course.tags && course.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-2">
                        {course.tags.map((tag, index) => (
                          <span key={index} className="bg-primary-500/30 backdrop-blur-sm text-white px-2 py-1 rounded-full text-xs">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center mr-2">
                        {course.user?.name?.charAt(0) || "?"}
                      </div>
                      <span>By {course.user?.name}</span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-gradient-to-br from-primary-600 via-primary-700 to-secondary-700 h-64 flex items-center justify-center">
                <h2 className="text-4xl font-bold text-white">{course.name}</h2>
              </div>
            )}
            
            {/* Course Content */}
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">About this skill</h3>
                  <p className="text-gray-600 mb-6 whitespace-pre-line">{course.description}</p>
                  
                  {course.googleMeetLink && (
                    <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
                      <h4 className="text-lg font-semibold text-blue-700 mb-2">Meeting Link</h4>
                      <a
                        href={course.googleMeetLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 underline flex items-center hover:text-blue-800"
                      >
                        <span className="mr-2">Join Google Meet</span>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </a>
                    </div>
                  )}
                </div>
                
                <div className="bg-gray-50 p-5 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Skill Details</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-500">Time Credit Value</p>
                      <p className="text-xl font-semibold text-primary-700">{course.timeCreditValue} credits</p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-500">Available Hours</p>
                      <p className="text-xl font-semibold text-gray-800">{course.availableHours} hours</p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-500">Instructor</p>
                      <div className="flex items-center mt-1">
                        <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center mr-2">
                          {course.user?.name?.charAt(0) || "?"}
                        </div>
                        <p className="font-medium">{course.user?.name}</p>
                      </div>
                    </div>
                    
                    {!purchasing ? (
                      <button
                        onClick={handlePurchase}
                        className="w-full mt-6 bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-700 hover:to-secondary-700 text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 flex items-center justify-center"
                      >
                        Purchase with Time Credits
                      </button>
                    ) : (
                      <div className="w-full mt-6 flex justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-600"></div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetails;
