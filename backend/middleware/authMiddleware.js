const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
    const token = req.header("Authorization");

    // ✅ Fix: Ensure token exists and has "Bearer " prefix
    if (!token || !token.startsWith("Bearer ")) {
        return res.status(401).json({ message: "No token, authorization denied" });
    }

    try {
        const extractedToken = token.split(" ")[1]; // ✅ Extract token from "Bearer TOKEN"
        const decoded = jwt.verify(extractedToken, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ message: "Invalid Token" });
    }
};

module.exports = authMiddleware;
