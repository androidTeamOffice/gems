const express = require("express");
const router = express.Router();
const axios = require("axios"); // Import axios for API calls
require("dotenv").config();

// Configuration: OTP length and expiry time (in milliseconds)
const OTP_LENGTH = 6;
const OTP_EXPIRY = 5 * 60 * 1000; // 5 minutes

// In-memory store for OTPs (Consider using Redis in production)
const otpStore = new Map();

// Helper function to generate a numeric OTP
const generateOTP = () => {
  let otp = "";
  for (let i = 0; i < OTP_LENGTH; i++) {
    otp += Math.floor(Math.random() * 10); // Generate a random digit (0-9)
  }
  return otp;
};

// ✅ **Send OTP via SMS**
router.post("/send-mobile-otp", async (req, res) => {
  const { mobile } = req.body;

  if (!mobile) {
    return res.status(400).json({ message: "Mobile number is required." });
  }
  // ✅ Convert Pakistani numbers (03xx...) to international format (923xx...)
  if (/^03\d{9}$/.test(mobile)) {
    mobile = "92" + mobile.substring(1); // Replace leading 0 with 92
  }

  console.log(`Processed Mobile Number: ${mobile}`);
  // Generate OTP
  const otp = generateOTP();
  console.log(`Generated OTP for ${mobile}: ${otp}`);

  // Store OTP and expiry in memory
  otpStore.set(mobile, { otp, expires: Date.now() + OTP_EXPIRY });

  // Prepare data for SMS API
  const data = new URLSearchParams({
    to: mobile,
    message: `Your OTP code is ${otp}. It will expire in 5 minutes.`,
    key: process.env.SMS_API_KEY, // Use an API key stored in `.env`
    email: "gems.net.pk.official@gmail.com",
    mask: "H3 TEST SMS",
  }).toString();

  try {
    // Send SMS via the external API
    const response = await axios.post("https://secure.h3techs.com/sms/api/send", data, {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });

    if (response.status === 200) {
      console.log(`OTP sent successfully to ${mobile}`);
      return res.status(200).json({ message: "OTP sent successfully to mobile." });
    } else {
      console.error("SMS API response:", response.data);
      return res.status(500).json({ message: "Failed to send OTP via SMS." });
    }
  } catch (error) {
    console.error("Error sending OTP via SMS:", error.message);
    return res.status(500).json({ message: "Error sending OTP via SMS." });
  }
});

// ✅ **Verify OTP**
router.post("/verify-otp", (req, res) => {
  const { mobile, otp } = req.body; // Identifier is now `mobile`

  if (!mobile || !otp) {
    return res.status(400).json({ message: "Mobile number and OTP are required." });
  }

  const stored = otpStore.get(mobile);

  if (!stored) {
    return res.status(400).json({ message: "OTP not found. Request a new OTP." });
  }

  if (Date.now() > stored.expires) {
    otpStore.delete(mobile);
    return res.status(400).json({ message: "OTP has expired. Request a new OTP." });
  }

  if (stored.otp !== otp) {
    return res.status(400).json({ message: "Invalid OTP. Try again." });
  }

  // OTP verified successfully, delete from store
  otpStore.delete(mobile);
  return res.status(200).json({ message: "OTP verified successfully." });
});

module.exports = router;
