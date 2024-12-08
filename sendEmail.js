const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'your-email@gmail.com', // Your Gmail
        pass: 'your-app-password'     // Your Gmail App Password
    }
});

const sendOTP = async (email, otp) => {
    const mailOptions = {
        from: 'your-email@gmail.com',
        to: email,
        subject: 'Email Verification OTP',
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #3498db;">Email Verification</h2>
                <p>Your OTP for email verification is:</p>
                <h1 style="color: #2c3e50; letter-spacing: 2px;">${otp}</h1>
                <p>This OTP will expire in 10 minutes.</p>
                <p>If you didn't request this, please ignore this email.</p>
            </div>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        return true;
    } catch (error) {
        console.error('Error sending email:', error);
        return false;
    }
};

module.exports = { sendOTP };