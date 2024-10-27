const express = require("express");
const { validateToken, checkManagerRole } = require("../utils/authMiddleware"); // Assuming the file is named authMiddleware.js
const {
  getAllDashboardCounters,
} = require("../models/dashboard"); // Assuming the file is named rank.js
require("dotenv").config();

const router = express.Router();

function handleError(err, res) {
  console.error(err);
  res.status(500).json({ message: "Internal server error" });
}

router.get("/dashboard_counters", validateToken, async (req, res) => {
  console.log("Fetching all dashboard counters!");
  try {
    const [rows, rowsLvs, rowsDuty, rowsCourse] = await getAllDashboardCounters();
    console.log("emps: " + rows[0].emps +", lvs: " +rowsLvs[0].lvs+", duty: "+rowsDuty[0].duty+", course: "+rowsCourse[0].course);
    const emps = parseInt(rows[0].emps) - parseInt(rowsLvs[0].lvs) - parseInt(rowsDuty[0].duty) - parseInt(rowsCourse[0].course);
    res.json({ onRest: emps, onLeave: rowsLvs[0].lvs, onDuty: rowsDuty[0].duty, onCourse: rowsCourse[0].course });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
