import React from "react";

const StatsCard = ({ title, value, icon, color }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 flex items-center">
      <div className={`p-3 rounded-full ${color} text-white mr-4`}>
        {icon}
      </div>
      <div>
        <p className="text-gray-500 text-sm">{title}</p>
        <p className="text-2xl font-bold">{value}</p>
      </div>
    </div>
  );
};

export default StatsCard;
