const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
    const cookies = req.headers.cookie;
    if (cookies) {
        jwt.verify(cookies.split("=")[1], "secret", (err, user) => {
            if (err) return res.render("users/login",{error : undefined});
            req.user = user;
            next();

        });
    } else {
        return res.render("users/login",{error : undefined});
    }
};

module.exports = verifyToken;