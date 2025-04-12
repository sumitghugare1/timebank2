import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getTransactionHistory } from "../services/transactionService";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { toast } from "react-toastify";

const TransactionHistory = () => {
  const [transactions, setTransactions] = useState([]);
  const [showSidebar, setShowSidebar] = useState(true);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    } else {
      fetchHistory();
    }
  }, [navigate]);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      // Direct API call for debugging
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5000/api/transactions", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      
      if (!response.ok) {
        throw new Error("Failed to fetch transaction history");
      }
      
      const data = await response.json();
      console.log("Transaction History (Raw):", data);
      setTransactions(data || []);
    } catch (error) {
      console.error("Error fetching transaction history:", error);
      toast.error("Failed to load transaction history: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar
        isLoggedIn={true}
        handleLogout={handleLogout}
        showSidebar={showSidebar}
        setShowSidebar={setShowSidebar}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Navbar */}
        <Navbar
          isLoggedIn={true}
          showSidebar={showSidebar}
          setShowSidebar={setShowSidebar}
        />

        {/* Transaction History Section */}
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold text-purple-700">
              Transaction History
            </h2>
            <button
              onClick={fetchHistory}
              className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition"
            >
              Refresh
            </button>
          </div>

          {loading ? (
            <div className="text-center py-10">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading transactions...</p>
            </div>
          ) : transactions && transactions.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {transactions.map((transaction) => (
                <div
                  key={transaction._id}
                  className="bg-white shadow-md p-5 rounded-lg hover:shadow-lg transition"
                >
                  <h4 className="text-lg font-bold text-purple-700">
                    {transaction.skill?.name || "Unknown Skill"}
                  </h4>
                  <p className="text-gray-600 mt-2">
                    {transaction.type === "earn" ? (
                      <span className="text-green-600 font-bold">
                        🟢 Earned
                      </span>
                    ) : (
                      <span className="text-red-600 font-bold">
                        🔴 Spent
                      </span>
                    )}{" "}
                    {Math.abs(transaction.amount)} credits
                  </p>
                  <p className="text-gray-500 text-sm mt-1">
                    {transaction.type === "earn"
                      ? `Earned by: ${
                          transaction.user?.name || "Unknown User"
                        }`
                      : `Spent by: ${
                          transaction.user?.name || "Unknown User"
                        }`}
                  </p>
                  <p className="text-gray-500 text-sm mt-1">
                    Date:{" "}
                    {new Date(transaction.createdAt).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white p-10 rounded-lg shadow text-center">
              <p className="text-gray-500 mb-4">
                No transaction history available.
              </p>
              <p className="text-gray-500">
                Purchase a course or provide a skill to start your transaction history.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TransactionHistory;
