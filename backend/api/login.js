const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const pool = require("../db/db"); // Assuming the file is named db.js
require("dotenv").config();

const { findUserByUsername } = require("../models/user");

const router = express.Router();
router.post("/login", async (req, res) => {
  const { username = "", password = "" } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Missing username or password" });
  }

  try {
    const user = await findUserByUsername(username);

    if (!user) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    const validPassword = await bcrypt.compare(password, user.password_hash);
    if (!validPassword) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    const payload = { userId: user.id, role: user.role };
    const secret = process.env.JWT_SECRET;
    const token = jwt.sign(payload, secret, { expiresIn: "30m" });

    const refreshToken = await generateRefreshToken(user.id);

    // Optionally, set the refresh token in an httpOnly cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Ensure secure flag is set in production
      sameSite: "Strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.json({
      message: "Login successful",
      user: user.username,
      token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

async function generateRefreshToken(userId) {
  // Replace with your logic to generate a secure random string
  const refreshToken =
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15);

  // Store the refresh token in the database associated with the user
  const [rows] = await pool.query(
    "UPDATE users SET refresh_token = ? WHERE id = ?",
    [refreshToken, userId]
  );

  if (rows.affectedRows === 0) {
    throw new Error("Failed to store refresh token");
  }

  return refreshToken;
}

router.post("/refresh", async (req, res) => {
  const refreshToken = req.cookies.refreshToken || req.body.refreshToken;

  if (!refreshToken) {
    return res.status(400).json({ message: "Missing refresh token" });
  }

  try {
    const [rows] = await pool.query(
      "SELECT * FROM users WHERE refresh_token = ?",
      [refreshToken]
    );
    const user = rows[0];

    if (!user) {
      return res.status(401).json({ message: "Invalid refresh token" });
    }

    const payload = { userId: user.id, role: user.role };
    const secret = process.env.JWT_SECRET;
    const newAccessToken = jwt.sign(payload, secret, { expiresIn: "30m" });

    res.json({ message: "Refresh successful", accessToken: newAccessToken });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
