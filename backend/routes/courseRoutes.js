const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const Skill = require("../models/Skill"); // Use Skill model consistently
const User = require("../models/User");

// ✅ Add Course
router.post("/add", authMiddleware, async (req, res) => {
  try {
    const { name, description, availableHours, timeCreditValue, googleMeetLink, tags, thumbnail } = req.body;

    const newCourse = new Skill({
      name,
      description,
      availableHours,
      timeCreditValue,
      googleMeetLink,
      tags,
      thumbnail, // ✅ Save the thumbnail URL
      user: req.user.userId,
    });

    await newCourse.save();
    res.status(201).json({ message: "Course added successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// ✅ Get All Courses
router.get("/", async (req, res) => {
  try {
    const courses = await Skill.find().populate("user", "name email");
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// ✅ Get Course Details by ID
router.get("/:id", authMiddleware, async (req, res) => {
  try {
    const course = await Skill.findById(req.params.id).populate("user", "name email timeCredits");
    if (!course) {
      return res.status(404).json({ message: "Course not found." });
    }
    res.status(200).json(course);
  } catch (error) {
    console.error("Error fetching course details:", error);
    res.status(500).json({ message: "Server error." });
  }
});

// ✅ Handle Course Purchase
router.post("/:id/purchase", authMiddleware, async (req, res) => {
  try {
    const course = await Skill.findById(req.params.id).populate("user");
    if (!course) {
      return res.status(404).json({ message: "Course not found." });
    }

    const buyer = await User.findById(req.user.userId);
    const seller = await User.findById(course.user._id);

    if (buyer.timeCredits < course.timeCreditValue) {
      return res.status(400).json({ message: "Insufficient time credits." });
    }

    // Deduct credits from buyer and add to seller
    buyer.timeCredits -= course.timeCreditValue;
    seller.timeCredits += course.timeCreditValue;

    await buyer.save();
    await seller.save();

    res.status(200).json({ message: "Course purchased successfully!" });
  } catch (error) {
    console.error("Error purchasing course:", error);
    res.status(500).json({ message: "Server error." });
  }
});

module.exports = router;
