const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User"); // Import User model
const authMiddleware = require("../middleware/authMiddleware"); // Import auth middleware
const Skill = require("../models/Skill"); // Import Skill model

// Signup Route
router.post("/signup", async (req, res) => {
    try {
        const { name, email, password } = req.body;

        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ message: "User already exists" });

        const hashedPassword = await bcrypt.hash(password, 10);
        user = new User({ name, email, password: hashedPassword });

        await user.save();
        res.status(201).json({ message: "User registered successfully!" });
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
});

// Login Route
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "Invalid credentials" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
        res.json({ 
            token, 
            userId: user._id,
            isAdmin: user.isAdmin || false // Send isAdmin status to client
        });
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
});

// Get User Profile
router.get("/profile", authMiddleware, async (req, res) => {
  try {
    // Fetch the user without the password field
    const user = await User.findById(req.user.userId).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Fetch skills associated with the user
    const skills = await Skill.find({ user: req.user.userId });
    res.status(200).json({ ...user.toObject(), skills });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({ message: "Server error." });
  }
});

// Check if user is admin
router.get("/is-admin", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select("isAdmin");
    if (!user) {
      return res.status(404).json({ isAdmin: false });
    }
    res.json({ isAdmin: user.isAdmin || false });
  } catch (error) {
    console.error("Error checking admin status:", error);
    res.status(500).json({ isAdmin: false });
  }
});

module.exports = router;
