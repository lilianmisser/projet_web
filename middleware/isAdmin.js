const isAdmin = (req, res, next) => {
    if (req.user.isAdmin) {
        next();
    } else {
        res.redirect("/home");
    }
};

module.exports = isAdmin;