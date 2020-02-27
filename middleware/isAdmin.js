const isAdmin = (req, res, next) => {
    if (req.user.isAdmin) {
        next();
    } else {
        res.status(403).render("accueil");
    }
};

module.exports = isAdmin;