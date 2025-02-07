const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");
require("dotenv").config();
// Configuration: OTP length and expiry time (in milliseconds)
const OTP_LENGTH = 6;
const OTP_EXPIRY = 5 * 60 * 1000; // 5 minutes

// In-memory store for OTPs. In production, use a persistent store like Redis.
const otpStore = new Map();

// Helper function to generate a numeric OTP of defined length
const generateOTP = () => {
  let otp = "";
  for (let i = 0; i < OTP_LENGTH; i++) {
    otp += Math.floor(Math.random() * 10); // generates a random digit 0-9
  }
  return otp;
};

// Setup Nodemailer transporter
const transporter = nodemailer.createTransport({
  // Example using Gmail; adjust for your email provider
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER, // your email address
    pass: process.env.EMAIL_PASS, // your email password or application-specific password
  },
});

// POST /api/send-otp
router.post("/api/send-otp", async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required." });
  }

  // Generate the OTP
  const otp = generateOTP();

  // Store OTP and its expiry time in the in-memory store
  otpStore.set(email, { otp, expires: Date.now() + OTP_EXPIRY });

  // Email options
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Your OTP Code",
    text: `Your OTP code is ${otp}. It will expire in 5 minutes.`,
  };

  try {
    // Send email with OTP
    await transporter.sendMail(mailOptions);
    console.log(`OTP sent to ${email}: ${otp}`);
    res.status(200).json({ message: "OTP sent successfully." });
  } catch (error) {
    console.error("Error sending OTP email:", error);
    res.status(500).json({ message: "Error sending OTP email." });
  }
});

module.exports = router;
