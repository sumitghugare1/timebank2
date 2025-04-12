import React, { useState } from "react";
import { earnCredits, spendCredits } from "../services/transactionService";
import { toast } from "react-toastify";

const SkillCard = ({ skill }) => {
  const [processing, setProcessing] = useState(false);

  const handleEarn = async () => {
    if (!skill._id) {
      toast.error("Invalid skill data");
      return;
    }
    
    setProcessing(true);
    try {
      await earnCredits(skill._id);
      toast.success("Credits Earned!");
    } catch (error) {
      console.error("Error earning credits:", error);
      toast.error(error.response?.data?.message || "Failed to earn credits");
    } finally {
      setProcessing(false);
    }
  };

  const handleSpend = async () => {
    if (!skill._id) {
      toast.error("Invalid skill data");
      return;
    }
    
    setProcessing(true);
    try {
      await spendCredits(skill._id);
      toast.success("Credits Spent!");
    } catch (error) {
      console.error("Error spending credits:", error);
      toast.error(error.response?.data?.message || "Failed to spend credits");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="border p-4 rounded shadow-md">
      <h3 className="text-lg font-bold">{skill.name}</h3>
      <p>{skill.description}</p>
      <p className="text-sm text-gray-500">
        Available Hours: {skill.availableHours}
      </p>
      <p className="text-sm text-gray-500">
        Credit Value: {skill.timeCreditValue}
      </p>
      <div className="flex gap-2 mt-2">
        <button
          onClick={handleEarn}
          disabled={processing}
          className={`${
            processing ? "bg-gray-400" : "bg-green-500 hover:bg-green-600"
          } text-white px-4 py-1 rounded transition`}
        >
          {processing ? "Processing..." : "Earn Credits"}
        </button>
        <button
          onClick={handleSpend}
          disabled={processing}
          className={`${
            processing ? "bg-gray-400" : "bg-red-500 hover:bg-red-600"
          } text-white px-4 py-1 rounded transition`}
        >
          {processing ? "Processing..." : "Spend Credits"}
        </button>
      </div>
    </div>
  );
};

export default SkillCard;
