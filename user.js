const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    otp: String,
    otpExpiry: Date
});

userSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model('User', userSchema);