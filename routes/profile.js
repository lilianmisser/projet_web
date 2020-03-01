const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/verifyToken");
const isAdmin = require("../middleware/isAdmin");
const profile = require("../controllers/profile_controller");

router.get("/", verifyToken, profile.get_profile_page);

module.exports = router;