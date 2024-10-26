const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const express = require("express");
const {
  getAllUsers,
  addUserToDatabase,
  updateUserInDatabase,
  findUserByUsername,
  findUserById,
  deleteUser,
} = require("../models/user"); // Assuming the file is named user.js
const { validateToken, checkManagerRole } = require("../utils/authMiddleware"); // Assuming the file is named authMiddleware.js
require("dotenv").config();

const router = express.Router();

router.get("/users_list", validateToken, async (req, res) => {
  console.log("Fetching all users list!");
  try {
    const users = await getAllUsers();
    res.json({ users });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});
router.post("/user_by_id", validateToken, async (req, res) => {
  const id = req.body.id;
  console.log("Finding user!");
  try {
    const user = await findUserById(id);
    if (user) {
      res.json({ user });
    } else {
      res.status(404).json({ message: "User with id: " + id + " not found." });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});
router.post("/add_user", validateToken, checkManagerRole, async (req, res) => {
  const { username, password, role } = req.body;
  try {
    // Check for missing fields
    if (!username || !password || !role) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    // Check for existing username
    const existingUser = await findUserByUsername(username);
    if (existingUser) {
      return res.status(400).json({ message: "Username already exists" });
    }
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    // Create a new user object

    const newUser = { username, password: hashedPassword, role: role.value };
    // Add user to the database (replace with your actual logic)
    const createdUser = await addUserToDatabase(newUser);
    const secret = process.env.JWT_SECRET;
    // Generate JWT token (optional)
    const token = jwt.sign({ userId: createdUser.id }, secret, {
      expiresIn: "30m",
    });
    res.json({
      message: "User created successfully",
      user: createdUser,
      token,
    }); // Include token and created user details if needed
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ message: "Internal server error" }); // Generic error for client-side handling
  }
});
// Route for updating a user (POST)
router.post(
  "/update_user",
  validateToken,
  checkManagerRole,
  async (req, res) => {
    const { id, username, password, role } = req.body;

    // Check for missing fields
    if (!username || !(password || role)) {
      // Allow updating either password or role
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Find user by username
    const user = await findUserById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    try {
      // Prepare updated user object
      const updatedUser = {};
      if (username) updatedUser.username = username;
      if (password) updatedUser.password = await bcrypt.hash(password, 10);
      if (role) updatedUser.role = role.value;

      // Update user in the database (using updateUserInDatabase)
      await updateUserInDatabase(user.id, updatedUser);

      res.json({ message: "User updated successfully" });
    } catch (error) {
      console.error("Error updating user:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);
router.post(
  "/delete_user",
  validateToken,
  checkManagerRole,
  async (req, res) => {
    const { id } = req.body;
    // Check for missing fields
    if (!id) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    try {
      const dutys = await deleteUser(id);
      console.log(dutys);
      if (dutys) res.status(200).json({ message: "User deleted successfully" });
      if (!dutys)
        res.status(500).json({ message: "User not deleted successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);

module.exports = router;
