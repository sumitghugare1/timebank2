const User = require("../models/User");

const adminMiddleware = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.userId);
    
    if (!user || !user.isAdmin) {
      return res.status(403).json({ message: "Access denied. Admin privileges required." });
    }
    
    next();
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

module.exports = adminMiddleware;
