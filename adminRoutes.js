const express = require("express");
const router = express.Router();
const User = require("./models/user");
const listings = require("./models/url");

// Middleware for checking admin status
const isAdmin = (req, res, next) => {
    if (req.isAuthenticated() && req.user.isAdmin) {
        return next();
    }
    req.flash("error", "Access denied. Admin privileges required.");
    res.redirect("/admin/login");
};

// Admin Dashboard
router.get("/dashboard", isAdmin, async (req, res) => {
    try {
        const allEvents = await listings.find({}).populate("owner");
        const totalUsers = await User.countDocuments();
        const totalEvents = await listings.countDocuments();
        
        res.render("admin/dashboard", {
            events: allEvents,
            totalUsers,
            totalEvents
        });
    } catch (err) {
        req.flash("error", "Error loading dashboard");
        res.redirect("/admin/login");
    }
});

// Admin Login
router.get("/login", (req, res) => {
    res.render("../views/users/adminLogin.ejs");
});

// Admin Events List
router.get("/events", isAdmin, async (req, res) => {
    try {
        const events = await listings.find({}).populate("owner");
        res.render("admin/events", { events });
    } catch (err) {
        req.flash("error", "Error loading events");
        res.redirect("/admin/dashboard");
    }
});

// Delete Event
router.delete("/events/:id", isAdmin, async (req, res) => {
    try {
        await listings.findByIdAndDelete(req.params.id);
        req.flash("success", "Event deleted successfully");
        res.redirect("/admin/events");
    } catch (err) {
        req.flash("error", "Error deleting event");
        res.redirect("/admin/events");
    }
});

module.exports = router;