import axios from "axios";
import { getApiUrl } from "../config/api";

const API_URL = getApiUrl("/api/chat");

export const getMessages = async () => {
  const res = await axios.get(API_URL);
  return res.data;
};

export const sendMessage = async (message) => {
  const res = await axios.post(API_URL, { text: message });
  return res.data;
};
