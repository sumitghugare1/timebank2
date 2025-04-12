import axios from "axios";

const API_URL = "https://timebank2.vercel.app/api/chat";

export const getMessages = async () => {
  const res = await axios.get(API_URL);
  return res.data;
};

export const sendMessage = async (message) => {
  const res = await axios.post(API_URL, { text: message });
  return res.data;
};
