const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");

const messages = [];

router.get("/", authMiddleware, (req, res) => {
  res.json(messages);
});

router.post("/", authMiddleware, (req, res) => {
  const { text } = req.body;
  const message = { user: req.user.name, text };
  messages.push(message);
  res.json(message);
});

module.exports = router;
