import axios from "axios";

const API_URL = "https://timebank2.vercel.app/api/transactions";

// ✅ Earn Credits
export const earnCredits = async (skillId) => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("No authentication token found");
  }
  
  console.log(`Earning credits for skill: ${skillId}`);
  
  const res = await axios.post(
    `${API_URL}/earn`,
    { skillId },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  
  console.log("Earn credits response:", res.data);
  return res.data;
};

// ✅ Spend Credits
export const spendCredits = async (skillId) => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("No authentication token found");
  }
  
  console.log(`Spending credits for skill: ${skillId}`);
  
  const res = await axios.post(
    `${API_URL}/spend`,
    { skillId },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  
  console.log("Spend credits response:", res.data);
  return res.data;
};

// ✅ Get Transaction History
export const getTransactionHistory = async () => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("No authentication token found");
  }
  
  console.log("Fetching transaction history...");
  
  // Using fetch instead of axios for direct debugging
  const response = await fetch(API_URL, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Transaction history error response:", errorText);
    throw new Error(`Failed to fetch transaction history: ${response.status}`);
  }

  const data = await response.json();
  console.log("Transaction history response:", data);
  return data;
};
