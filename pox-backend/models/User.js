const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    phoneNumber: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    companyName: { type: String },
    isAgency: { type: Boolean, default: false },
    avatar: { type: String, default: "/uploads/default-avatar.png" },  // Default avatar
    isAdmin: { type: Boolean, default: false },  // Admin field
}, { timestamps: true });

module.exports = mongoose.model("User", UserSchema);
