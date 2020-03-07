const user_model = require("../models/user_model");
const jwt = require("jsonwebtoken");
const Errors = require("../models/errors");
const data_for_autocomplete = require("../functions/data_for_autocomplete");

exports.get_register_page = async (req, res) => {
    try {
        let auto_data = await data_for_autocomplete();
        res.render('users/register', { error: undefined, auto_data });
    }
    catch{
        res.status(503);
    }
};

exports.register = async (req, res) => {
    try {
        let auto_data = await data_for_autocomplete();
        let err = user_model.check_informations(req.body.username, req.body.firstname, req.body.lastname, req.body.email, req.body.pwd);
        if (err == undefined) {
            try {
                await user_model.create_user(req.body.username, req.body.firstname, req.body.lastname, req.body.email, req.body.pwd);
                res.redirect("/users/login");
            }
            catch (error) {
                switch (error) {
                    case Errors.DB_UNAVAILABLE:
                        res.status(503);
                    case Errors.USERNAME_ALREADY_EXISTS:
                        res.render("users/register", { error: error.message, auto_data });;
                    case Errors.MAIL_ALREADY_EXISTS:
                        res.render("users/register", { error: error.message, auto_data });;
                }
            }
        }
        else {
            res.render("users/register", { error: err, auto_data });
        }
    }
    catch{
        res.status(503);
    }
};

exports.get_login_page = async (req, res) => {
    try {
        let auto_data = await data_for_autocomplete();
        res.render('users/login', { error: undefined, auto_data });
    }
    catch{
        res.status(503);
    }
};

exports.login = async (req, res) => {
    if (!(req.body.username && req.body.pwd)) {
        res.redirect("/users/login");
    }
    else {
        try {
            let auto_data = await data_for_autocomplete();
            try {
                const login_result = await user_model.find_user(req.body.username, req.body.pwd);
                const tokenToSend = jwt.sign({
                    username: login_result.user[0],
                    user_id: login_result.user[1],
                    isAdmin: login_result.user[2]
                },
                    process.env.SECRET_KEY,
                    { expiresIn: "1h" });
                res.cookie("jwt", tokenToSend);
                res.redirect("/home");
            }
            catch (error) {
                res.render("users/login", { error: error.message , auto_data});
            }
        }
        catch{
            res.status(503);
        }
    }
};

exports.logout = (req, res) => {
    res.clearCookie("jwt");
    res.redirect('/users/login');
};