const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const Skill = require("../models/Skill");

// ✅ Add Skill (Updated Route)
router.post("/", authMiddleware, async (req, res) => {
    try {
        const { name, description, availableHours, timeCreditValue, googleMeetLink, tags } = req.body;

        // Validate required fields
        if (!name || !description || !availableHours || !timeCreditValue || !googleMeetLink) {
            return res.status(400).json({ message: "All fields are required." });
        }

        // Create a new skill
        const skill = new Skill({
            name,
            description,
            availableHours, // Ensure this matches the model
            timeCreditValue,
            googleMeetLink,
            tags,
            user: req.user.userId, // Assuming authMiddleware adds user info
        });

        await skill.save();
        res.status(201).json({ message: "Skill added successfully!", skill });
    } catch (error) {
        console.error("Error adding skill:", error);
        res.status(500).json({ message: "Server Error", error: error.message });
    }
});

// ✅ Get All Skills
router.get("/", async (req, res) => {
    try {
        const skills = await Skill.find().populate("user", "name email");
        res.json(skills);
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
});

// ✅ Get User's Skills
router.get("/my-skills", authMiddleware, async (req, res) => {
    try {
        const skills = await Skill.find({ user: req.user.userId });
        res.json(skills);
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
});

// ✅ Delete Skill
router.delete("/:id", authMiddleware, async (req, res) => {
    try {
        const skill = await Skill.findById(req.params.id);
        if (!skill) {
            return res.status(404).json({ message: "Skill not found" });
        }
        if (skill.user.toString() !== req.user.userId) {
            return res.status(401).json({ message: "Not authorized" });
        }
        await skill.deleteOne();
        res.json({ message: "Skill deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
});

// ✅ Suggest Complementary Skills (using Tags)
router.get("/suggestions", authMiddleware, async (req, res) => {
    try {
        const userSkills = await Skill.find({ user: req.user.userId }).select("tags");
        const userTags = userSkills.flatMap(skill => skill.tags);

        const complementarySkills = await Skill.find({
            tags: { $in: userTags },
            user: { $ne: req.user.userId }
        }).populate("user", "name email");

        res.json(complementarySkills);
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
});

// ✅ Get Skill Details (For Individual Skill)
router.get("/:id", async (req, res) => {
    try {
        const skill = await Skill.findById(req.params.id).populate("user", "name email");
        if (!skill) {
            return res.status(404).json({ message: "Skill not found" });
        }
        res.json(skill);
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
});

module.exports = router;
