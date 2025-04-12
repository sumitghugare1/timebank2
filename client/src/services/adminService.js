import axios from "axios";

const API_URL = "http://localhost:5000/api/admin";

// Get auth token
const getAuthToken = () => {
  return localStorage.getItem("adminToken") || localStorage.getItem("token");
};

// Get dashboard stats
export const getAdminStats = async () => {
  try {
    const res = await axios.get(`${API_URL}/stats`, {
      headers: { Authorization: `Bearer ${getAuthToken()}` },
    });
    return res.data;
  } catch (error) {
    console.error("Error getting admin stats:", error);
    throw error;
  }
};

// User management
export const getAllUsers = async () => {
  try {
    const res = await axios.get(`${API_URL}/users`, {
      headers: { Authorization: `Bearer ${getAuthToken()}` },
    });
    return res.data;
  } catch (error) {
    console.error("Error getting users:", error);
    throw error;
  }
};

export const getUserById = async (id) => {
  try {
    const res = await axios.get(`${API_URL}/users/${id}`, {
      headers: { Authorization: `Bearer ${getAuthToken()}` },
    });
    return res.data;
  } catch (error) {
    console.error("Error getting user:", error);
    throw error;
  }
};

export const updateUser = async (id, userData) => {
  try {
    const res = await axios.put(`${API_URL}/users/${id}`, userData, {
      headers: { Authorization: `Bearer ${getAuthToken()}` },
    });
    return res.data;
  } catch (error) {
    console.error("Error updating user:", error);
    throw error;
  }
};

export const deleteUser = async (id) => {
  try {
    const res = await axios.delete(`${API_URL}/users/${id}`, {
      headers: { Authorization: `Bearer ${getAuthToken()}` },
    });
    return res.data;
  } catch (error) {
    console.error("Error deleting user:", error);
    throw error;
  }
};

// Skills management
export const getAllSkills = async () => {
  try {
    const res = await axios.get(`${API_URL}/skills`, {
      headers: { Authorization: `Bearer ${getAuthToken()}` },
    });
    return res.data;
  } catch (error) {
    console.error("Error getting skills:", error);
    throw error;
  }
};

export const updateSkill = async (id, skillData) => {
  try {
    const res = await axios.put(`${API_URL}/skills/${id}`, skillData, {
      headers: { Authorization: `Bearer ${getAuthToken()}` },
    });
    return res.data;
  } catch (error) {
    console.error("Error updating skill:", error);
    throw error;
  }
};

export const deleteSkill = async (id) => {
  try {
    const res = await axios.delete(`${API_URL}/skills/${id}`, {
      headers: { Authorization: `Bearer ${getAuthToken()}` },
    });
    return res.data;
  } catch (error) {
    console.error("Error deleting skill:", error);
    throw error;
  }
};

// Transactions
export const getAllTransactions = async () => {
  try {
    const res = await axios.get(`${API_URL}/transactions`, {
      headers: { Authorization: `Bearer ${getAuthToken()}` },
    });
    return res.data;
  } catch (error) {
    console.error("Error getting transactions:", error);
    throw error;
  }
};

// Check if user is admin
export const checkAdminStatus = async () => {
  const token = getAuthToken();
  if (!token) return { isAdmin: false };
  
  try {
    const res = await axios.get("http://localhost:5000/api/auth/is-admin", {
      headers: { Authorization: `Bearer ${token}` }
    });
    return res.data;
  } catch (error) {
    console.error("Error checking admin status:", error);
    return { isAdmin: false };
  }
};
