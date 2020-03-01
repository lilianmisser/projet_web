const jwt = require("jsonwebtoken");

const login_access = (req, res, next) => {
    const cookies = req.cookies;
    if (cookies) {
        jwt.verify(cookies.jwt, "secret", (err, user) => {
            //error means that my user is not logged in
            if (err){
                res.clearCookie("jwt");
                next();
            }
            //user can't access login page if hes logged
            else{
                return res.redirect("/home");
            }
        });
    } else {
        res.clearCookie("jwt");
        next();
    }
};

module.exports = login_access;