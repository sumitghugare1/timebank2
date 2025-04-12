import { useEffect, useState } from "react";
import axios from "axios";

const UserCredits = () => {
  const [credits, setCredits] = useState(0);

  useEffect(() => {
    const fetchCredits = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/auth/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCredits(res.data.timeCredits);
      } catch (error) {
        console.error("Error fetching credits", error);
      }
    };

    fetchCredits();
  }, []);

  return (
    <div className="bg-gray-100 p-4 rounded shadow-md">
      <h2 className="text-lg font-bold">Your Credits</h2>
      <p className="text-xl">{credits} Credits</p>
    </div>
  );
};

export default UserCredits;
