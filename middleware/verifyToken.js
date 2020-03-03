const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
    const cookies = req.cookies;
    if (cookies) {
        jwt.verify(cookies.jwt, process.env.SECRET_KEY, (err, user) => {
            if (err) return res.render("users/login",{error : undefined});
            req.user = user;
            next();

        });
    } else {
        return res.render("users/login",{error : undefined});
    }
};

module.exports = verifyToken;