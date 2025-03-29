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
  host: 'h39.eu.core.hostnext.net', // Verified SMTP server 
  port: 465, // Port 
  //for secure SMTP (SSL/TLS) 
  secure: true, // Use SSL/TLS 
  auth: {
    user: process.env.EMAIL_USER,       // Your email address
    pass: process.env.EMAIL_PASS,       // The correct password for the account
  },

  tls: {
    // WARNING: This disables certificate validation and is insecure!
    rejectUnauthorized: true,
  },
  // Optional: Enable debug output for troubleshooting
  logger: true,
  debug: true
});



// POST /api/send-otp
router.post("/send-otp", async (req, res) => {
  const { email } = req.body;
  // console.log("ema: ",process.env.EMAIL_PASS);
  //   console.log("pass: ",process.env.EMAIL_USER);
  if (!email) {
    return res.status(400).json({ message: "Email is required." });
  }

  // Generate the OTP
  const otp = generateOTP();
  //console.log("otp: ",otp);
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

// Send OTP via SMS (Fixed to 123456 for security reasons)
router.post("/send-mobile-otp", (req, res) => {
  const { mobile } = req.body;
  if (!mobile) return res.status(400).json({ message: "Mobile number is required." });

  const otp = generateOTP();
  otpStore.set(mobile, { otp, expires: Date.now() + OTP_EXPIRY });

  res.status(200).json({ message: "OTP sent successfully to mobile." });
});

// Verify OTP (for both email and mobile)
router.post("/verify-otp", (req, res) => {
  const { identifier, otp } = req.body; // identifier can be email or mobile
  if (!identifier || !otp) return res.status(400).json({ message: "Identifier and OTP are required." });

  const stored = otpStore.get(identifier);
  if (!stored) return res.status(400).json({ message: "OTP not found. Request a new OTP." });

  if (Date.now() > stored.expires) {
    otpStore.delete(identifier);
    return res.status(400).json({ message: "OTP has expired. Request a new OTP." });
  }

  if (stored.otp !== otp) return res.status(400).json({ message: "Invalid OTP. Try again." });

  otpStore.delete(identifier);
  res.status(200).json({ message: "OTP verified successfully." });
});

module.exports = router;