const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/verifyToken.js");
const login_access = require("../middleware/login_access");
const register_access = require("../middleware/register_access");
const users = require("../controllers/users_controller");

router.get("/register", register_access, users.get_register_page);

router.post("/register", users.register);

router.get("/login", login_access, users.get_login_page);

router.post("/login", users.login);

router.get("/logout", verifyToken, users.logout);

module.exports = router;