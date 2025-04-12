const mongoose = require("mongoose");

const skillSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  availableHours: { type: Number, required: true },
  timeCreditValue: { type: Number, default: 1 },
  googleMeetLink: { type: String },
  tags: [{ type: String }],
  thumbnail: { type: String }, // ✅ Added thumbnail field
}, { timestamps: true });

module.exports = mongoose.model("Skill", skillSchema);
