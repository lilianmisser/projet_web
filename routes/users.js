const express = require("express");
const router = express.Router();
const user_model = require("../models/user_model");
const jwt = require("jsonwebtoken");
const verifyToken = require("../middleware/verifyToken.js");

router.get("/register", (req, res) => {
    res.render('register');
});

router.post("/register", (req, res) => {
    const err = user_model.check_informations(req.body.username, req.body.firstname, req.body.lastname, req.body.email, req.body.pwd);
    if (err == undefined) {
        user_model.create_user(req.body.username, req.body.firstname, req.body.lastname, req.body.email, req.body.pwd);
        res.redirect("login");
    }
    else {
        res.send(err);
    }
});

router.get("/login", (req, res) => {
    res.render('login');
})

router.post("/login", async (req, res) => {
    if (!(req.body.username && req.body.pwd)) {
        res.send("please insert all informations");
    }
    else {
        const login_result = await user_model.find_user(req.body.username, req.body.pwd);
        if (login_result.user) {
            const tokenToSend = jwt.sign({
                username: login_result.user[0],
                user_id: login_result.user[1],
                isAdmin: login_result.user[2]
            },
                'secret',
                { expiresIn: "1h" });
            res.cookie("jwt", tokenToSend);
            res.redirect("/home");
        }
        else {
            res.send(login_result.error)
            res.redirect("/home");
        }
    }
})

router.get("/logout", verifyToken,(req,res) => {
    res.clearCookie("jwt");
    res.redirect('/users/login');
})

module.exports = router;