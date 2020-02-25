const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
    const token = req.headers.cookie;
    if (token) {
        jwt.verify(token.split("=")[1], "secret", (err, user) => {
            if (err) return res.redirect("/users/login");
            req.user = user;
            next();

        });
    } else {
        return res.redirect("/users/login");
    }
};

module.exports = verifyToken;