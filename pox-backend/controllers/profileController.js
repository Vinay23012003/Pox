const User = require("../models/User");
const fs = require("fs");
const path = require("path");

// Fetch user profile
exports.getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Upload profile image
exports.uploadAvatar = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded" });
        }

        // Delete previous avatar if it exists (except default)
        if (user.avatar && user.avatar !== "/uploads/default-avatar.png") {
            const oldPath = path.join(__dirname, "..", user.avatar);
            if (fs.existsSync(oldPath)) {
                fs.unlinkSync(oldPath);
            }
        }

        // Save new avatar path
        user.avatar = `/uploads/${req.file.filename}`;
        await user.save();

        res.json({ avatar: user.avatar });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Remove profile image (Reset to default)
exports.removeAvatar = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Delete current avatar (except default)
        if (user.avatar && user.avatar !== "/uploads/default-avatar.png") {
            const avatarPath = path.join(__dirname, "..", user.avatar);
            if (fs.existsSync(avatarPath)) {
                fs.unlinkSync(avatarPath);
            }
        }

        // Set to default avatar
        user.avatar = "/uploads/default-avatar.png";
        await user.save();

        res.json({ message: "Avatar removed", avatar: user.avatar });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
