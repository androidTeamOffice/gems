const express = require("express");
const { validateToken, checkManagerRole } = require("../utils/authMiddleware"); // Assuming the file is named authMiddleware.js
const {
  addDutyToDatabase,
  findDutyById,
  updateDutyInDatabase,
  getAllDuties,
  deleteDuty,
  findDutyByNameAndAppt,
} = require("../models/duty"); // Assuming the file is named duty.js
require("dotenv").config();
const router = express.Router();

function handleError(err, res) {
  console.error(err);
  res.status(500).json({ message: "Internal server error" });
}

router.post("/add_duty", validateToken, checkManagerRole, async (req, res) => {
  const {
    dutyname,
    description,
    cadreSpecific,
    locationId,
    
    appt_id,
    duration,
    emp_req,
    occurance_in_day,
  } = req.body;

  // Validation (optional)
  if (!dutyname) {
    return res
      .status(400)
      .json({ message: "Missing required field: dutyname" });
  }
  if (!description) {
    return res
      .status(400)
      .json({ message: "Missing required field: description" });
  }
  if (!cadreSpecific) {
    return res
      .status(400)
      .json({ message: "Missing required field: TraitSpecific" });
  }
  if (!locationId) {
    return res
      .status(400)
      .json({ message: "Missing required field: locationId" });
  }
  if (!appt_id) {
    return res
      .status(400)
      .json({ message: "Missing required field: appt_id" });
  }
  if (!duration) {
    return res
      .status(400)
      .json({ message: "Missing required field: duration" });
  }
  if (!emp_req) {
    return res.status(400).json({ message: "Missing required field: emp_req" });
  }
  
  if (!occurance_in_day) {
    return res
      .status(400)
      .json({ message: "Missing required field: occurance_in_day" });
  }

  // Check for existing duty
  const existingDuty = await findDutyByNameAndAppt(dutyname, appt_id.value);
  if (existingDuty) {
    return res
      .status(400)
      .json({ message: "Duty with same name and appt already exists" });
  }

  try {
    duty = await addDutyToDatabase({
      name: dutyname,
      description: description,
      cadre_specific: cadreSpecific.value,
      location_id: locationId.value,
      
      appt_id: appt_id.value,
      duration: duration,
      emp_req: emp_req,
      occurance_in_day: occurance_in_day,
    });
    res.json({ message: "Duty created successfully", duty: duty }); // Return created duty ID
  } catch (error) {
    handleError(error, res);
  }
});
router.post("/duty_by_id", validateToken, async (req, res) => {
  const { id } = req.body;
  console.log("Finding duty!");
  try {
    const duty = await findDutyById(id);
    if (duty) {
      res.json({ duty });
    } else {
      res.status(404).json({ message: "Duty with id: " + id + " not found." });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});
// Route for updating a duty (POST)
router.post(
  "/update_duty",
  validateToken,
  checkManagerRole,
  async (req, res) => {
    const {
      id,
      dutyname,
      description,
      cadreSpecific,
      locationId,
      
      appt_id,
      duration,
      emp_req,
      occurance_in_day,
    } = req.body;

    // Check for missing fields
    if (
      !dutyname ||
      !description ||
      !cadreSpecific ||
      !locationId ||
      !id ||
      
      !appt_id ||
      !duration ||
      !emp_req ||
      !occurance_in_day
    ) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Find user by id
    const duty = await findDutyById(id);
    if (!duty) {
      return res.status(404).json({ message: "Duty not found" });
    }

    try {
      // Prepare updated duty object
      const updatedduty = {};
      if (dutyname) updatedduty.name = dutyname;
      if (description) updatedduty.description = description;
      if (cadreSpecific) updatedduty.cadre_specific = cadreSpecific.value;
      if (locationId) updatedduty.location_id = locationId.value;
      
      if (appt_id) updatedduty.appt_id = appt_id.value;
      if (duration) updatedduty.duration = duration;
      if (emp_req) updatedduty.emp_req = emp_req;
      if (occurance_in_day) updatedduty.occurance_in_day = occurance_in_day;

      // Update duty in the database (using updateDutyInDatabase)
      await updateDutyInDatabase(duty.id, updatedduty);

      res.json({ message: "Duty updated successfully" });
    } catch (error) {
      console.error("Error updating duty:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);
router.get("/dutys_list", validateToken, async (req, res) => {
  console.log("Fetching all dutys list!");
  try {
    const dutys = await getAllDuties();
    console.log("Duty" + dutys);
    res.json({ dutys });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});
router.post(
  "/delete_duty",
  validateToken,
  checkManagerRole,
  async (req, res) => {
    const { id } = req.body;
    // Check for missing fields
    if (!id) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    try {
      const dutys = await deleteDuty(id);
      console.log(dutys);
      if (dutys) res.status(200).json({ message: "Duty deleted successfully" });
      if (!dutys)
        res.status(500).json({ message: "Duty not deleted successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);

module.exports = router;
