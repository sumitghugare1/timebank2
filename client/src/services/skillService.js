import axios from "axios";

const API_URL = "http://localhost:5000/api/skills";

export const getSuggestions = async () => {
  const res = await axios.get(`${API_URL}/suggestions`);
  return res.data;
};
