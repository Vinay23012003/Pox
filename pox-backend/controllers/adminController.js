const User = require("../models/User");

// Get all users
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select("-password"); // Hide password
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Delete a user
exports.deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: "User not found" });

        await user.deleteOne();
        res.json({ message: "User deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Toggle Admin Status
exports.toggleAdmin = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: "User not found" });

        user.isAdmin = !user.isAdmin; // Toggle admin status
        await user.save();

        res.json({ message: "Admin status updated", user });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
