const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/verifyToken");
const isAdmin = require("../middleware/isAdmin");
const profile = require("../controllers/profile_controller");

router.get("/", verifyToken, profile.get_profile_page);

router.get("/update/:id",verifyToken, profile.get_update_page);

router.post("/:id", verifyToken, profile.update);

//router.get("/delete/:id", verifyToken, isAdmin, profile.delete_id);

module.exports = router;