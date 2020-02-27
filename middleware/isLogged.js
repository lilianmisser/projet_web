const jwt = require("jsonwebtoken");

const isLogged = (req, res, next) => {
    const token = req.headers.cookie;
    if (token) {
        jwt.verify(token.split("=")[1], "secret", (err, user) => {
            if (err) return res.redirect("/users/login");
            req.user = user;
            res.redirect("/home");

        });
    } else {
        next();
    }
};

module.exports = isLogged;