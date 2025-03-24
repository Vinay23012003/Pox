const express = require("express");
const { register, login } = require("../controllers/autCountrollers");
const upload = require("../middleware/upload");

const router = express.Router();

router.post("/register", upload.single("avatar"), register);
router.post("/login", login);

module.exports = router;
