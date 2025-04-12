import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const AddCourse = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    thumbnail: "",
    date: "",
    time: "",
    meetLink: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5000/api/courses/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        window.location.href = "http://localhost:3000/explore";
      }
    } catch (error) {
      console.error("Error adding course:", error);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-8 bg-white rounded-lg shadow-lg">
      <h2 className="text-3xl font-bold text-purple-700 mb-6 text-center">Add New Course</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
        <div className="md:col-span-2">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-gray-700 text-sm font-semibold mb-2">Course Title</label>
              <input 
                type="text" 
                name="title" 
                placeholder="Enter an engaging title" 
                value={formData.title} 
                onChange={handleChange} 
                required 
                className="input focus:ring-2 focus:ring-purple-500" 
              />
            </div>
            
            <div>
              <label className="block text-gray-700 text-sm font-semibold mb-2">Description</label>
              <textarea 
                name="description" 
                placeholder="Describe what students will learn" 
                value={formData.description} 
                onChange={handleChange} 
                required 
                className="input min-h-[120px]" 
              />
            </div>
            
            <div>
              <label className="block text-gray-700 text-sm font-semibold mb-2">Thumbnail URL</label>
              <input 
                type="text" 
                name="thumbnail" 
                placeholder="Enter image URL for course thumbnail" 
                value={formData.thumbnail} 
                onChange={handleChange} 
                required 
                className="input" 
              />
              <p className="text-xs text-gray-500 mt-1">Recommended size: 1280x720 pixels</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 text-sm font-semibold mb-2">Date</label>
                <input 
                  type="date" 
                  name="date" 
                  value={formData.date} 
                  onChange={handleChange} 
                  required 
                  className="input" 
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-semibold mb-2">Time</label>
                <input 
                  type="time" 
                  name="time" 
                  value={formData.time} 
                  onChange={handleChange} 
                  required 
                  className="input" 
                />
              </div>
            </div>
            
            <div>
              <label className="block text-gray-700 text-sm font-semibold mb-2">Meeting Link</label>
              <input 
                type="url" 
                name="meetLink" 
                placeholder="Google Meet or Zoom link" 
                value={formData.meetLink} 
                onChange={handleChange} 
                required 
                className="input" 
              />
            </div>
            
            <button 
              type="submit" 
              className="w-full bg-gradient-to-r from-purple-600 to-purple-800 text-white py-3 rounded-md hover:from-purple-700 hover:to-purple-900 transition duration-300 font-semibold shadow-md"
            >
              Add Course
            </button>
          </form>
        </div>
        
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-medium text-gray-700 mb-4">Thumbnail Preview</h3>
          <div className="aspect-video rounded-lg overflow-hidden bg-gray-200 shadow-inner flex items-center justify-center">
            {formData.thumbnail ? (
              <img 
                src={formData.thumbnail} 
                alt="Course thumbnail preview" 
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "https://via.placeholder.com/640x360?text=Invalid+Image+URL";
                }}
              />
            ) : (
              <div className="text-gray-400 text-center px-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p>Thumbnail preview will appear here</p>
              </div>
            )}
          </div>
          
          <div className="mt-6">
            <h3 className="font-medium text-gray-700 mb-2">Course Details</h3>
            <div className="text-sm text-gray-600">
              <p><span className="font-semibold">Title:</span> {formData.title || "Not specified"}</p>
              <p><span className="font-semibold">Date:</span> {formData.date || "Not specified"}</p>
              <p><span className="font-semibold">Time:</span> {formData.time || "Not specified"}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddCourse;
