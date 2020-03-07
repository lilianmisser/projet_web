const isAdmin = (req, res, next) => {
    if (req.user.isAdmin === 1) {
        next();
    } else {
        res.status(403).redirect("/home");
    }
};

module.exports = isAdmin;