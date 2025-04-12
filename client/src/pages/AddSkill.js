import React, { useState } from "react";
import axios from "axios";

function AddSkill() {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [hoursAvailable, setHoursAvailable] = useState("");

    const handleAddSkill = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem("token");
        if (!token) {
            alert("You must be logged in to add a skill.");
            return;
        }
        try {
            await axios.post(
                "http://localhost:5000/api/skills/add",
                { name, description, hoursAvailable },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            alert("✅ Skill added successfully!");
            setName("");
            setDescription("");
            setHoursAvailable("");
        } catch (error) {
            alert("❌ Failed to add skill: " + error.response?.data?.message);
        }
    };

    return (
        <div className="bg-white shadow-md rounded-lg p-4 flex items-center space-x-4">
            {/* Skill Name */}
            <input
                type="text"
                placeholder="Skill Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-1/4 p-2 border rounded-md focus:ring-2 focus:ring-purple-400 outline-none"
            />

            {/* Skill Description */}
            <input
                type="text"
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                className="w-1/3 p-2 border rounded-md focus:ring-2 focus:ring-purple-400 outline-none"
            />

            {/* Hours Available */}
            <input
                type="number"
                placeholder="Hours"
                value={hoursAvailable}
                onChange={(e) => setHoursAvailable(e.target.value)}
                required
                className="w-1/5 p-2 border rounded-md focus:ring-2 focus:ring-purple-400 outline-none"
            />

            {/* Submit Button */}
            <button
                type="submit"
                onClick={handleAddSkill}
                className="bg-purple-600 text-white font-semibold px-4 py-2 rounded-md hover:bg-purple-700 transition"
            >
                Add Skill
            </button>
        </div>
    );
}

export default AddSkill;
