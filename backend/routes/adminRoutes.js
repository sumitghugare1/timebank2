const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");
const User = require("../models/User");
const Skill = require("../models/Skill");
const Transaction = require("../models/Transaction");

// Get Dashboard Stats
router.get("/stats", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalSkills = await Skill.countDocuments();
    const totalTransactions = await Transaction.countDocuments();
    
    // Get recent transactions
    const recentTransactions = await Transaction.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("user", "name email")
      .populate("skill", "name");
    
    // Get credits distribution
    const creditsData = await User.aggregate([
      { $group: { _id: null, totalCredits: { $sum: "$timeCredits" } } }
    ]);
    
    const totalCredits = creditsData.length > 0 ? creditsData[0].totalCredits : 0;

    res.json({
      stats: {
        totalUsers,
        totalSkills,
        totalTransactions,
        totalCredits
      },
      recentTransactions
    });
  } catch (error) {
    console.error("Admin stats error:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

// Get all users
router.get("/users", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

// Get user by ID
router.get("/users/:id", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

// Update user
router.put("/users/:id", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { name, email, timeCredits, isAdmin } = req.body;
    
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { name, email, timeCredits, isAdmin },
      { new: true }
    ).select("-password");
    
    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

// Delete user
router.delete("/users/:id", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

// Get all skills
router.get("/skills", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const skills = await Skill.find().populate("user", "name email");
    res.json(skills);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

// Update skill
router.put("/skills/:id", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const updatedSkill = await Skill.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    
    if (!updatedSkill) {
      return res.status(404).json({ message: "Skill not found" });
    }
    
    res.json(updatedSkill);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

// Delete skill
router.delete("/skills/:id", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const skill = await Skill.findByIdAndDelete(req.params.id);
    if (!skill) {
      return res.status(404).json({ message: "Skill not found" });
    }
    res.json({ message: "Skill deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

// Get all transactions
router.get("/transactions", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const transactions = await Transaction.find()
      .populate("user", "name email")
      .populate("skill", "name")
      .sort({ createdAt: -1 });
    
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;
