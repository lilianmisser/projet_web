const user_model = require("../models/user_model");
const jwt = require("jsonwebtoken");

exports.get_register_page = (req, res) => {
    res.render('users/register', { error: undefined });
};

exports.register = (req, res) => {
    let err = user_model.check_informations(req.body.username, req.body.firstname, req.body.lastname, req.body.email, req.body.pwd);
    if(err == undefined){
        try{
            user_model.create_user(req.body.username, req.body.firstname, req.body.lastname, req.body.email, req.body.pwd);
            res.redirect("/login");
        }
        catch(error){
            switch(error){
                case user_model.Errors.DB_UNAVAILABLE :
                    res.status(503);
                case user_model.Errors.USERNAME_ALREADY_EXISTS :
                    res.render("users/register", { error: error.message });;
                case user_model.Errors.MAIL_ALREADY_EXISTS :
                    res.render("users/register", { error: error.message });;
            }
        }
    }
    else{
        res.render("users/register", { error: err })
    }
};

exports.get_login_page = (req, res) => {
    res.render('users/login', { error: undefined });
};

exports.login = async (req, res) => {
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
            res.render("users/login", { error: error.message }); 
        }
    }
};

exports.logout = (req, res) => {
    res.clearCookie("jwt");
    res.redirect('/users/login');
};