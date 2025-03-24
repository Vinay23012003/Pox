const express = require("express");
const { getProfile, uploadAvatar, removeAvatar } = require("../controllers/profileController");
const { authMiddleware } = require("../middleware/authMiddleware");
const upload = require("../middleware/upload");

const router = express.Router();

// Fetch user profile (Protected Route)
router.get("/", authMiddleware, getProfile);

// Upload profile avatar
router.put("/avatar", authMiddleware, upload.single("avatar"), uploadAvatar);

// Remove profile avatar
router.put("/remove-avatar", authMiddleware, removeAvatar);

module.exports = router;
