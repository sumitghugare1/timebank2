// API Configuration
const API_CONFIG = {
  // Use environment variable if available, otherwise fallback to production URL
  BASE_URL: process.env.REACT_APP_API_URL || 'https://timebankbackend.vercel.app',
  
  // API endpoints
  ENDPOINTS: {
    AUTH: '/api/auth',
    SKILLS: '/api/skills',
    TRANSACTIONS: '/api/transactions',
    COURSES: '/api/courses',
    ADMIN: '/api/admin',
    CHAT: '/api/chat'
  }
};

// Helper function to build full API URLs
export const getApiUrl = (endpoint) => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};

// Export base URL for direct use
export const API_BASE_URL = API_CONFIG.BASE_URL;

export default API_CONFIG;
