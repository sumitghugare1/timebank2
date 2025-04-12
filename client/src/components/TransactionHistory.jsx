import React, { useEffect, useState } from "react";
import { getTransactionHistory } from "../services/transactionService";
import { toast } from "react-toastify";

const TransactionHistory = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTransactions = async () => {
      setLoading(true);
      try {
        const data = await getTransactionHistory();
        console.log("Transactions loaded:", data);
        setTransactions(data);
      } catch (error) {
        console.error("Error fetching transactions:", error);
        toast.error("Failed to load transaction history");
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  if (loading) {
    return <div className="p-4 text-center">Loading transaction history...</div>;
  }

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Transaction History</h2>
      {transactions && transactions.length > 0 ? (
        transactions.map((transaction) => (
          <div key={transaction._id} className="border p-2 mb-2 rounded">
            <p>
              <strong>Type:</strong>{" "}
              <span
                className={`${
                  transaction.type === "earn" ? "text-green-500" : "text-red-500"
                }`}
              >
                {transaction.type}
              </span>
            </p>
            <p>
              <strong>Amount:</strong> {transaction.amount}
            </p>
            <p>
              <strong>Skill:</strong>{" "}
              {transaction.skill ? transaction.skill.name : "N/A"}
            </p>
            <p>
              <strong>Date:</strong>{" "}
              {new Date(transaction.createdAt).toLocaleString()}
            </p>
          </div>
        ))
      ) : (
        <p>No transactions yet.</p>
      )}
    </div>
  );
};

export default TransactionHistory;
