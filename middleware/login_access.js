const jwt = require("jsonwebtoken");

const login_access = (req, res, next) => {
    const token = req.headers.cookie;
    if (token) {
        jwt.verify(token.split("=")[1], "secret", (err, user) => {
            //error means that my user is not logged in
            if (err){
                res.render("users/login",{error: undefined});
                next();
            }
            //user can't access login page if hes logged
            else{
                return res.redirect("/home");
            }
        });
    } else {
        next();
    }
};

module.exports = login_access;