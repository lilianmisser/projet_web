const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
    const token = req.headers.cookie;
    if (token) {
        jwt.verify(token.split("=")[1], "secret", (err, user) => {
            if (err) return res.render("users/login",{error : undefined});
            req.user = user;
            next();

        });
    } else {
        return res.render("users/login",{error : undefined});
    }
};

module.exports = verifyToken;