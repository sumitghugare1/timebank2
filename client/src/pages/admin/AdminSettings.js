import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import AdminSidebar from "../../components/admin/AdminSidebar";
import axios from "axios";

const AdminSettings = () => {
  const [settings, setSettings] = useState({
    defaultCredits: 5,
    transactionExpiration: 86400, // 1 day in seconds
    siteTitle: "Virtual Time Bank",
    allowPublicRegistration: true,
    maintenanceMode: false
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setSettings({ ...settings, [e.target.name]: value });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // This would be a real API call in a production app
      // await axios.put("http://localhost:5000/api/admin/settings", settings, {
      //   headers: { Authorization: `Bearer ${localStorage.getItem("adminToken")}` },
      // });
      
      // For now, just simulate success
      setTimeout(() => {
        toast.success("Settings saved successfully!");
        setLoading(false);
      }, 800);
      
    } catch (error) {
      console.error("Error saving settings:", error);
      toast.error("Error saving settings");
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <AdminSidebar />
      
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">System Settings</h1>
          
          <div className="bg-white rounded-lg shadow-md overflow-hidden p-6">
            <form onSubmit={handleSave} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Default Credits for New Users
                  </label>
                  <input
                    type="number"
                    name="defaultCredits"
                    value={settings.defaultCredits}
                    onChange={handleChange}
                    className="border rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Transaction Expiration (seconds)
                  </label>
                  <input
                    type="number"
                    name="transactionExpiration"
                    value={settings.transactionExpiration}
                    onChange={handleChange}
                    className="border rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Site Title
                  </label>
                  <input
                    type="text"
                    name="siteTitle"
                    value={settings.siteTitle}
                    onChange={handleChange}
                    className="border rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                
                <div className="flex flex-col justify-end">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="allowPublicRegistration"
                      checked={settings.allowPublicRegistration}
                      onChange={handleChange}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <label className="ml-2 block text-sm text-gray-900">
                      Allow Public Registration
                    </label>
                  </div>
                  
                  <div className="flex items-center mt-4">
                    <input
                      type="checkbox"
                      name="maintenanceMode"
                      checked={settings.maintenanceMode}
                      onChange={handleChange}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <label className="ml-2 block text-sm text-gray-900">
                      Maintenance Mode
                    </label>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  {loading ? "Saving..." : "Save Settings"}
                </button>
              </div>
            </form>
          </div>
          
          <div className="mt-8 bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">System Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border rounded-md p-4">
                <p className="text-sm text-gray-600">Node.js Version</p>
                <p className="font-medium">v16.14.2</p>
              </div>
              
              <div className="border rounded-md p-4">
                <p className="text-sm text-gray-600">MongoDB Version</p>
                <p className="font-medium">v5.0.6</p>
              </div>
              
              <div className="border rounded-md p-4">
                <p className="text-sm text-gray-600">React Version</p>
                <p className="font-medium">v19.0.0</p>
              </div>
              
              <div className="border rounded-md p-4">
                <p className="text-sm text-gray-600">Last Updated</p>
                <p className="font-medium">{new Date().toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;
