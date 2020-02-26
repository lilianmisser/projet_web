const express = require("express");
const router = express.Router();
const user_model = require("../models/user_model");
const jwt = require("jsonwebtoken");
const verifyToken = require("../middleware/verifyToken.js");

router.get("/register", (req, res) => {
    res.render('users/register', { error: undefined });
});

router.post("/register", (req, res) => {
    const err = user_model.check_informations(req.body.username, req.body.firstname, req.body.lastname, req.body.email, req.body.pwd);
    if (err == undefined) {
        const error = user_model.create_user(req.body.username, req.body.firstname, req.body.lastname, req.body.email, req.body.pwd);
        if (error) {
            res.render("users/register", { error: error });
        }
        else {
            res.redirect("/login");
        }
    }
    else {
        res.render("users/register", { error: err });
    }
});

router.get("/login", (req, res) => {
    res.render('users/login', { error: undefined });
})

router.post("/login", async (req, res) => {
    if (!(req.body.username && req.body.pwd)) {
        res.redirect("/users/login", { error: "please insert all informations" });
    }
    else {
        try{
            const login_result = await user_model.find_user(req.body.username, req.body.pwd);
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
        catch(error){
            res.render("users/login", { error: error.error }); 
        }
    }
})

router.get("/logout", verifyToken, (req, res) => {
    res.clearCookie("jwt");
    res.redirect('/users/login');
})

module.exports = router;