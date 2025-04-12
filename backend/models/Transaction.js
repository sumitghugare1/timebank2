const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    skill: { type: mongoose.Schema.Types.ObjectId, ref: "Skill" },
    type: { type: String, enum: ["earn", "spend"], required: true },
    amount: { type: Number, required: true }, // Positive for earn, negative for spend
    createdAt: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

// Add an index for faster querying
transactionSchema.index({ user: 1, createdAt: -1 });

const Transaction = mongoose.model("Transaction", transactionSchema);

module.exports = Transaction;
