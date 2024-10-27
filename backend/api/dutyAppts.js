const express = require("express");
const { validateToken, checkManagerRole } = require("../utils/authMiddleware"); // Assuming the file is named authMiddleware.js
const {
  addDutyApptToDatabase,
  findDutyApptByName,
  findDutyApptById,
  updateDutyApptInDatabase,
  getAllDutyAppts,
  deleteDutyAppt,
} = require("../models/dutyAppt"); // Assuming the file is named duty_appt.js
require("dotenv").config();

const router = express.Router();

function handleError(err, res) {
  console.error(err);
  res.status(500).json({ message: "Internal server error" });
}

router.post("/add_duty_appt", validateToken, checkManagerRole, async (req, res) => {
  const { duty_apptname } = req.body;

  // Validation (optional)
  if (!duty_apptname) {
    return res
      .status(400)
      .json({ message: "Missing required field: duty_apptname" });
  }

  // Check for existing duty_appt
  const existingDutyAppt = await findDutyApptByName(duty_apptname);
  if (existingDutyAppt) {
    return res
      .status(400)
      .json({ message: "DutyAppt with same name already exists" });
  }

  try {
    duty_appt = await addDutyApptToDatabase({ name: duty_apptname });
    res.json({ message: "DutyAppt created successfully", duty_appt: duty_appt }); // Return created duty_appt ID
  } catch (error) {
    handleError(error, res);
  }
});
router.post("/duty_appt_by_id", validateToken, async (req, res) => {
  const id = req.body.id;
  console.log("Finding duty_appt!");
  try {
    const duty_appt = await findDutyApptById(id);
    if (duty_appt) {
      res.json({ duty_appt });
    } else {
      res.status(404).json({ message: "DutyAppt with id: " + id + " not found." });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});
// Route for updating a duty_appt (POST)
router.post(
  "/update_duty_appt",
  validateToken,
  checkManagerRole,
  async (req, res) => {
    const { id, duty_apptName } = req.body;

    // Check for missing fields
    if (!duty_apptName || !id) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Find user by id
    const duty_appt = await findDutyApptById(id);
    if (!duty_appt) {
      return res.status(404).json({ message: "DutyAppt not found" });
    }

    try {
      // Prepare updated duty_appt object
      const updatedduty_appt = {};
      if (duty_apptName) duty_appt.name = duty_apptName;

      // Update duty_appt in the database (using updateDutyApptInDatabase)
      await updateDutyApptInDatabase(duty_appt.id, duty_appt);

      res.json({ message: "DutyAppt updated successfully" });
    } catch (error) {
      console.error("Error updating duty_appt:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);
router.get("/duty_appts_list", validateToken, async (req, res) => {
  console.log("Fetching all duty_appts list!");
  try {
    const duty_appts = await getAllDutyAppts();
    res.json({ duty_appts });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});
router.post(
  "/delete_duty_appt",
  validateToken,
  checkManagerRole,
  async (req, res) => {
    const { id } = req.body;
    // Check for missing fields
    if (!id) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    try {
      const duty_appts = await deleteDutyAppt(id);
      console.log(duty_appts);
      if (duty_appts) res.status(200).json({ message: "DutyAppt deleted successfully" });
      if (!duty_appts)
        res.status(500).json({ message: "DutyAppt not deleted successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);

module.exports = router;
