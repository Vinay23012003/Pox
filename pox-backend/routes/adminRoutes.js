const express = require("express");
const { getAllUsers, deleteUser, toggleAdmin } = require("../controllers/adminController");
const { authMiddleware, adminMiddleware } = require("../middleware/authMiddleware");

const router = express.Router();

// Get all users (Admin only)
router.get("/users", authMiddleware, adminMiddleware, getAllUsers);

// Delete a user (Admin only)
router.delete("/users/:id", authMiddleware, adminMiddleware, deleteUser);

// Promote/Demote user to/from admin
router.put("/users/:id/admin", authMiddleware, adminMiddleware, toggleAdmin);

module.exports = router;
