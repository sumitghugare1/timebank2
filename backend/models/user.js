const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    skills: { type: [String], default: [] },
    timeCredits: { type: Number, default: 5 },   // Default 5 credits for new users
    isAdmin: { type: Boolean, default: false },  // Admin flag
});

module.exports = mongoose.model("User", userSchema);
