const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const Transaction = require("../models/Transaction");
const User = require("../models/User");
const Skill = require("../models/Skill");

// Debug middleware for transaction routes
router.use((req, res, next) => {
  console.log(`Transaction Route: ${req.method} ${req.originalUrl}`);
  next();
});

// ✅ Get All Transactions
router.get("/", authMiddleware, async (req, res) => {
  try {
    console.log(`Fetching transactions for user: ${req.user.userId}`);
    
    const transactions = await Transaction.find({ user: req.user.userId })
      .populate("user", "name email")
      .populate("skill", "name")
      .sort({ createdAt: -1 });

    console.log(`Found ${transactions.length} transactions`);
    
    res.json(transactions);
  } catch (error) {
    console.error("Error fetching transactions:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

// ✅ Earn Credits
router.post("/earn", authMiddleware, async (req, res) => {
  try {
    const { skillId } = req.body;
    
    if (!skillId) {
      return res.status(400).json({ message: "Skill ID is required" });
    }

    console.log(`Earning credits for skill: ${skillId} by user: ${req.user.userId}`);
    
    const skill = await Skill.findById(skillId);
    if (!skill) {
      return res.status(404).json({ message: "Skill not found" });
    }

    const creditValue = skill.timeCreditValue || 1;

    // Create transaction record
    const transaction = new Transaction({
      user: req.user.userId,
      skill: skillId,
      type: "earn",
      amount: creditValue,
    });
    
    await transaction.save();
    console.log("Transaction created:", transaction);

    // Update user credits
    const updatedUser = await User.findByIdAndUpdate(
      req.user.userId,
      { $inc: { timeCredits: creditValue } },
      { new: true }
    );
    
    console.log(`User credits updated to: ${updatedUser.timeCredits}`);

    res.json({
      message: `You earned ${creditValue} credits!`,
      transaction: transaction._id
    });
  } catch (error) {
    console.error("Error in earn credits:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

// ✅ Spend Credits
router.post("/spend", authMiddleware, async (req, res) => {
  try {
    const { skillId } = req.body;
    
    if (!skillId) {
      return res.status(400).json({ message: "Skill ID is required" });
    }
    
    console.log(`Spending credits for skill: ${skillId} by user: ${req.user.userId}`);
    
    const skill = await Skill.findById(skillId).populate("user");
    if (!skill) {
      return res.status(404).json({ message: "Skill not found" });
    }

    const creditValue = skill.timeCreditValue || 1;

    // Check if user has enough credits
    const spender = await User.findById(req.user.userId);
    if (!spender) {
      return res.status(404).json({ message: "User not found" });
    }
    
    if (spender.timeCredits < creditValue) {
      return res.status(400).json({ message: "Insufficient credits" });
    }

    // Deduct credits from spender
    spender.timeCredits -= creditValue;
    await spender.save();
    console.log(`Credits deducted from ${spender.name}: ${creditValue}`);

    // Create a spend transaction
    const spendTransaction = new Transaction({
      user: req.user.userId,
      skill: skillId,
      type: "spend",
      amount: -creditValue,  // Store as negative to show it's spent
    });
    
    await spendTransaction.save();
    console.log("Spend transaction created:", spendTransaction);

    // Give credits to skill owner if different from spender
    if (skill.user && skill.user._id.toString() !== req.user.userId) {
      // Update skill owner's credits
      const updatedOwner = await User.findByIdAndUpdate(
        skill.user._id,
        { $inc: { timeCredits: creditValue } },
        { new: true }
      );
      
      console.log(`Credits added to ${updatedOwner.name}: ${creditValue}`);
      
      // Create earn transaction for skill owner
      const earnTransaction = new Transaction({
        user: skill.user._id,
        skill: skillId,
        type: "earn",
        amount: creditValue,
      });
      
      await earnTransaction.save();
      console.log("Earn transaction created for skill owner:", earnTransaction);
    }

    res.json({
      message: `You spent ${creditValue} credits!`,
      transaction: spendTransaction._id
    });
  } catch (error) {
    console.error("Error in spend credits:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

// ✅ Get Transaction History by ID
router.get("/:id", authMiddleware, async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id)
      .populate("user", "name email")
      .populate("skill", "name");
    
    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }
    
    // Ensure user can only see their own transactions
    if (transaction.user._id.toString() !== req.user.userId) {
      return res.status(403).json({ message: "Not authorized to view this transaction" });
    }
    
    res.json(transaction);
  } catch (error) {
    console.error("Error fetching transaction:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

module.exports = router;
