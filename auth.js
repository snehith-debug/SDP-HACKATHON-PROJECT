const express = require('express');
const router = express.Router();
const User = require('../models/user');
const { sendOTP } = require('../utils/sendEmail');
const crypto = require('crypto');

// Generate OTP
const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

// Sign Up Route
router.post("/signUp", async(req, res) => {
    try {
        let {username, email, password} = req.body;
        
        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            req.flash("error", "Email already registered");
            return res.redirect("/signUp");
        }

        // Generate OTP
        const otp = generateOTP();
        const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes expiry

        // Create new user
        const newUser = new User({
            username,
            email,
            otp,
            otpExpiry,
            isVerified: false
        });

        // Register user
        const registeredUser = await User.register(newUser, password);

        // Send OTP
        const emailSent = await sendOTP(email, otp);
        if (!emailSent) {
            await User.findByIdAndDelete(registeredUser._id);
            req.flash("error", "Error sending verification email");
            return res.redirect("/signUp");
        }

        req.flash("success", "Please check your email for OTP verification");
        res.redirect(`/verify-email?email=${email}`);

    } catch(err) {
        console.log(err);
        req.flash("error", err.message);
        res.redirect("/signUp");
    }
});

// Verify Email Page
router.get("/verify-email", (req, res) => {
    const email = req.query.email;
    res.render("users/verify-email", { email });
});

// Verify OTP Route
router.post("/verify-otp", async (req, res) => {
    try {
        const { email, otp } = req.body;
        
        const user = await User.findOne({ 
            email,
            otp,
            otpExpiry: { $gt: Date.now() }
        });

        if (!user) {
            req.flash("error", "Invalid or expired OTP");
            return res.redirect(`/verify-email?email=${email}`);
        }

        // Update user verification status
        user.isVerified = true;
        user.otp = undefined;
        user.otpExpiry = undefined;
        await user.save();

        // Auto-login after verification
        await req.login(user, (err) => {
            if (err) return next(err);
            req.flash("success", "Email verified successfully!");
            res.redirect("/");
        });

    } catch (error) {
        console.error(error);
        req.flash("error", "Error verifying email");
        res.redirect("/signUp");
    }
});