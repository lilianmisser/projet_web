const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
    const cookies = req.cookies;
    if (cookies) {
        jwt.verify(cookies.jwt, process.env.SECRET_KEY, (err, user) => {
            if (err) {
                req.user = {isAdmin : -1};
                next();
            }
            else{
                req.user = user;
                next();
            }
        });
    } else {
        req.user = {isAdmin : -1};
        next();
    }
};

module.exports = verifyToken;