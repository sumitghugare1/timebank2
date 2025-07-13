import axios from "axios";
import { getApiUrl } from "../config/api";

const API_URL = getApiUrl("/api/skills");

export const getSuggestions = async () => {
  const res = await axios.get(`${API_URL}/suggestions`);
  return res.data;
};
