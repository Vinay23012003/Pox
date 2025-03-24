const jwt = require("jsonwebtoken");
const User = require("../models/User");

exports.authMiddleware = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.split(" ")[1]; // Extract token
    if (!token) return res.status(401).json({ message: "No token, authorization denied" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    next();
  } catch (err) {
    res.status(401).json({ message: "Token is not valid" });
  }
};


exports.adminMiddleware = (req, res, next) => {
    if (!req.user.isAdmin) return res.status(403).json({ message: "Access Denied" });
    next();
};
