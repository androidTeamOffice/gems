const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const express = require("express");
const {
  getAllLeaveCircles,
  addLeaveCircleToDatabase,
  updateLeaveCircleInDatabase,
  findLeaveCircleByName,
  findLeaveCircleById,
  deleteLeaveCircle,
} = require("../models/leavecircle"); // Assuming the file is named user.js
const { validateToken, checkManagerRole } = require("../utils/authMiddleware"); // Assuming the file is named authMiddleware.js
require("dotenv").config();

const router = express.Router();

router.get("/leave_circle_list", validateToken, async (req, res) => {
  console.log("Fetching all Leave Circle list!");
  try {
    const lveCircle = await getAllLeaveCircles();
    res.json({ lveCircle });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});
router.post("/leave_circle_by_id", validateToken, async (req, res) => {
  const id = req.body.id;
  console.log("Finding Leave Circle!");
  try {
    const leaveCircle = await findLeaveCircleById(id);
    if (leaveCircle) {
      res.json({ leaveCircle });
    } else {
      res
        .status(404)
        .json({ message: "LeaveCircle with id: " + id + " not found." });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});
router.post(
  "/add_leave_circle",
  validateToken,
  checkManagerRole,
  async (req, res) => {
    const { circleName, distance, lveGrant } = req.body;
    try {
      // Check for missing fields
      if (!circleName || !distance || !lveGrant) {
        return res.status(400).json({ message: "Missing required fields" });
      }
      // Check for existing username
      const existingLeaveCircle = await findLeaveCircleByName(circleName);
      if (existingLeaveCircle) {
        return res.status(400).json({ message: "Leave Circle already exists" });
      }

      const newLeaveCircle = {
        circleName,
        distance,
        lveGrant,
      };

      const createdLeaveCircle = await addLeaveCircleToDatabase(newLeaveCircle);

      res.json({
        message: "Leave Circle created successfully",
        leaveCircle: createdLeaveCircle,
      }); // Include token and created user details if needed
    } catch (error) {
      console.error("Error creating user:", error);
      res.status(500).json({ message: "Internal server error" }); // Generic error for client-side handling
    }
  }
);
// Route for updating a user (POST)
router.post(
  "/update_leave_cirle",
  validateToken,
  checkManagerRole,
  async (req, res) => {
    const { id, circleName, distance, lveGrant } = req.body;

    // Check for missing fields
    if (!circleName || !(distance || lveGrant)) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const leaveCircle = await findLeaveCircleById(id);
    if (!leaveCircle) {
      return res.status(404).json({ message: "Leave Circle not found" });
    }

    try {
      // Prepare updated user object
      const updatedLeaveCircle = {};
      if (circleName) updatedLeaveCircle.name = circleName;
      if (distance) updatedLeaveCircle.distance = distance;
      if (lveGrant) updatedLeaveCircle.lveGt = lveGrant;

      // Update in the database (using updateLeaveCircleInDatabase)
      await updateLeaveCircleInDatabase(leaveCircle.id, updatedLeaveCircle);

      res.json({ message: "LeaveCircle updated successfully" });
    } catch (error) {
      console.error("Error updating user:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);
router.post(
  "/delete_leave_circle",
  validateToken,
  checkManagerRole,
  async (req, res) => {
    const { id } = req.body;
    // Check for missing fields
    if (!id) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    try {
      const dutys = await deleteLeaveCircle(id);
      console.log(dutys);
      if (dutys)
        res.status(200).json({ message: "LeaveCircle deleted successfully" });
      if (!dutys)
        res
          .status(500)
          .json({ message: "LeaveCircle not deleted successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);

module.exports = router;
