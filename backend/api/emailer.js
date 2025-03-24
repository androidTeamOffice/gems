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
//   console.log("ema: ",process.env.EMAIL_PASS);
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

// POST /api/verify-otp - verifies the OTP for a given email
router.post("/verify-otp", (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({ message: "Email and OTP are required." });
  }

  // Retrieve the stored OTP data for this email
  const stored = otpStore.get(email);
  if (!stored) {
    return res.status(400).json({ message: "OTP not found. Please request a new OTP." });
  }

  // Check if the OTP has expired
  if (Date.now() > stored.expires) {
    otpStore.delete(email); // Remove expired OTP
    return res.status(400).json({ message: "OTP has expired. Please request a new OTP." });
  }

  // Compare the provided OTP with the stored one
console.log("stored.otp: ",stored.otp);
console.log("otp: ",otp);
console.log("stored.otp!==otp: ",(stored.otp!==otp));
  if (stored.otp !== otp) {
    return res.status(400).json({ message: "Invalid OTP. Please try again." });
  }

  // If verification succeeds, remove the OTP to prevent reuse
  otpStore.delete(email);

  // Respond with a success message
  res.status(200).json({ message: "OTP verified successfully." });
});



module.exports = router;
