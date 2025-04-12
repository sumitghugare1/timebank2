import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiEdit, FiTrash2, FiCheck, FiX } from "react-icons/fi";
import { toast } from "react-toastify";
import AdminSidebar from "../../components/admin/AdminSidebar";
import { getAllSkills, updateSkill, deleteSkill } from "../../services/adminService";

const AdminSkills = () => {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingSkill, setEditingSkill] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    availableHours: 0,
    timeCreditValue: 0,
    googleMeetLink: "",
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const data = await getAllSkills();
        setSkills(data);
      } catch (error) {
        console.error("Error fetching skills:", error);
        if (error.response?.status === 403) {
          navigate("/admin/login");
        }
        toast.error("Error fetching skills");
      } finally {
        setLoading(false);
      }
    };
    
    fetchSkills();
  }, [navigate]);

  const handleEdit = (skill) => {
    setEditingSkill(skill._id);
    setFormData({
      name: skill.name,
      description: skill.description || "",
      availableHours: skill.availableHours,
      timeCreditValue: skill.timeCreditValue,
      googleMeetLink: skill.googleMeetLink || "",
    });
  };

  const handleSave = async (id) => {
    try {
      const updatedSkill = await updateSkill(id, formData);
      setSkills(skills.map(skill => skill._id === id ? updatedSkill : skill));
      setEditingSkill(null);
      toast.success("Skill updated successfully");
    } catch (error) {
      console.error("Error updating skill:", error);
      toast.error("Error updating skill");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this skill?")) {
      try {
        await deleteSkill(id);
        setSkills(skills.filter(skill => skill._id !== id));
        toast.success("Skill deleted successfully");
      } catch (error) {
        console.error("Error deleting skill:", error);
        toast.error("Error deleting skill");
      }
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <AdminSidebar />
      
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">Skill Management</h1>
          
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hours</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Credits</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created By</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {skills.map((skill) => (
                    <tr key={skill._id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {editingSkill === skill._id ? (
                          <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="border rounded px-2 py-1 w-full"
                          />
                        ) : (
                          skill.name
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {editingSkill === skill._id ? (
                          <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            className="border rounded px-2 py-1 w-full"
                            rows="2"
                          />
                        ) : (
                          skill.description
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {editingSkill === skill._id ? (
                          <input
                            type="number"
                            name="availableHours"
                            value={formData.availableHours}
                            onChange={handleChange}
                            className="border rounded px-2 py-1 w-20"
                          />
                        ) : (
                          skill.availableHours
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {editingSkill === skill._id ? (
                          <input
                            type="number"
                            name="timeCreditValue"
                            value={formData.timeCreditValue}
                            onChange={handleChange}
                            className="border rounded px-2 py-1 w-20"
                          />
                        ) : (
                          skill.timeCreditValue
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {skill.user?.name || "Unknown"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        {editingSkill === skill._id ? (
                          <div className="flex space-x-2 justify-end">
                            <button
                              onClick={() => handleSave(skill._id)}
                              className="text-green-600 hover:text-green-900"
                            >
                              <FiCheck size={18} />
                            </button>
                            <button
                              onClick={() => setEditingSkill(null)}
                              className="text-red-600 hover:text-red-900"
                            >
                              <FiX size={18} />
                            </button>
                          </div>
                        ) : (
                          <div className="flex space-x-2 justify-end">
                            <button
                              onClick={() => handleEdit(skill)}
                              className="text-indigo-600 hover:text-indigo-900"
                            >
                              <FiEdit size={18} />
                            </button>
                            <button
                              onClick={() => handleDelete(skill._id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              <FiTrash2 size={18} />
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {skills.length === 0 && (
                <p className="text-center py-4 text-gray-500">No skills found</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSkills;
