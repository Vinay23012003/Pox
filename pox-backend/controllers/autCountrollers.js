const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

// User Registration
exports.register = async (req, res) => {
    try {
        console.log("Incoming Request Body:", req.body);

        const { fullName, phoneNumber, email, password, companyName, isAgency } = req.body;
        let avatar = "/uploads/default-avatar.png"; // Default avatar

        // Validation Check
        if (!fullName || !email || !password) {
            return res.status(400).json({ message: "Full Name, Email, and Password are required!" });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        if (req.file) {
            avatar = "/uploads/" + req.file.filename; // If user uploads an image
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ 
            fullName, 
            phoneNumber, 
            email, 
            password: hashedPassword, 
            companyName, 
            isAgency: isAgency || false,  
            avatar 
        });

        await user.save();

        res.status(201).json({ message: "User registered successfully", user });
    } catch (error) {
        console.error("❌ Server Error:", error.message); // Debugging
        res.status(500).json({ error: "Internal Server Error", message: error.message });
    }
};


// User Login
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user) return res.status(404).json({ message: "User not found" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

        const token = jwt.sign({ id: user._id, isAdmin: user.isAdmin }, process.env.JWT_SECRET, { expiresIn: "1d" });
        res.json({ message: "Login successful", token, user });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
