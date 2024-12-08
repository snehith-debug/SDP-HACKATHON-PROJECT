const isAdmin = (req, res, next) => {
    if (req.isAuthenticated() && req.user.isAdmin) {
        return next();
    }
    req.flash("error", "Access denied. Admin privileges required.");
    res.redirect("/admin/login");
};

module.exports = { isAdmin };