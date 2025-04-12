import axios from "axios";

const API_URL = "https://timebank2.vercel.app/api/skills";

export const getSuggestions = async () => {
  const res = await axios.get(`${API_URL}/suggestions`);
  return res.data;
};
