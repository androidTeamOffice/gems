const express = require("express");
const router = express.Router();
require("dotenv").config();
const { google } = require("googleapis");

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

//------------Gmail API Setup using OAuth2 -----------

const OAuth2 = google.auth.OAuth2;
const oauth2Client = new OAuth2(
  process.env.GMAIL_CLIENT_ID,
  process.env.GMAIL_CLIENT_SECRET,
  process.env.GMAIL_REDIRECT_URI
);

// Make sure to set the refresh token (it is used to obtain an access token automatically)
oauth2Client.setCredentials({
  refresh_token: process.env.GMAIL_REFRESH_TOKEN,
});

/**
 * sendEmail - Uses the Gmail API to send an email.
 * @param {string} to - Recipient email address.
 * @param {string} subject - Email subject.
 * @param {string} message - Email body text.
 */
async function sendEmail(to, subject, message) {
  const gmail = google.gmail({ version: "v1", auth: oauth2Client });
  const rawMessage = makeBody(to, process.env.GMAIL_USER_EMAIL, subject, message);
  const res = await gmail.users.messages.send({
    userId: "me",
    requestBody: {
      raw: rawMessage,
    },
  });
  return res.data;
}

/**
 * makeBody - Creates a base64url encoded email body.
 * @param {string} to - Recipient email.
 * @param {string} from - Sender email.
 * @param {string} subject - Subject of the email.
 * @param {string} message - Body of the email.
 */
function makeBody(to, from, subject, message) {
  const str = [
    `Content-Type: text/plain; charset="UTF-8"`,
    "MIME-Version: 1.0",
    "Content-Transfer-Encoding: 7bit",
    `to: ${to}`,
    `from: ${from}`,
    `subject: ${subject}`,
    "",
    message,
  ].join("\n");

  return Buffer.from(str)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

// ----- OTP Endpoint using Gmail API -----

// POST /api/send-otp
router.post("/send-otp", async (req, res) => {
  const { email } = req.body;
  console.log("ema: ",process.env.GMAIL_USER_EMAIL);
  if (!email) {
    return res.status(400).json({ message: "Email is required." });
  }

  // Generate the OTP
  const otp = generateOTP();

  // Store OTP and its expiry time in the in-memory store
  otpStore.set(email, { otp, expires: Date.now() + OTP_EXPIRY });

  // Email options
  const subject= "Your OTP Code";
  const text= `Your OTP code is ${otp}. It will expire in 5 minutes.`;

 try {
    await sendEmail(email, subject, text);
    console.log(`OTP sent to ${email}: ${otp}`);
    res.status(200).json({ message: "OTP sent successfully." });
  } catch (error) {
    console.error("Error sending OTP email via Gmail API:", error);
    res.status(500).json({ message: "Error sending OTP email." });
  }


});

module.exports = router;
