const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/verifyToken");
const home = require("../controllers/home_controller");

router.get("/", (req,res) =>{
    res.redirect("/home");
});

router.get("/home",verifyToken, home.get_home_page);

module.exports = router;