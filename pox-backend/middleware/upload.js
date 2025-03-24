const multer = require("multer");
const path = require("path");

// Ensure uploads folder exists
const fs = require("fs");
const uploadDir = path.join(__dirname, "..", "uploads");
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

// Multer Storage Configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/"); // Store in uploads folder
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
    },
});

// File type filter
const fileFilter = (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
    
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        console.log("Rejected File Type:", file.mimetype);
        cb(new Error("Invalid file type. Only JPG, JPEG, and PNG are allowed."), false);
    }
};

const upload = multer({ storage, fileFilter });

module.exports = upload;
