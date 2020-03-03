const jwt = require("jsonwebtoken");

const register_access = (req, res, next) => {
    const cookies = req.cookies;
    if (cookies) {
        jwt.verify(cookies.jwt, process.env.SECRET_KEY, (err, user) => {
            //error means that my user is not logged in
            if (err){
                res.clearCookie("jwt");
                next();
            }
            //user can't access register page if hes logged
            else{
                return res.redirect("/home");
            }
        });
    } else {
        res.clearCookie("jwt");
        next();
    }
};

module.exports = register_access;