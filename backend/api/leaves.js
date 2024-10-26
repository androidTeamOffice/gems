const express = require("express");
const { validateToken, checkManagerRole } = require("../utils/authMiddleware"); // Assuming the file is named authMiddleware.js
const {
  addLeaveToDatabase,
  findLeaveByArmyNo,
  findLeaveById,
  updateLeaveInDatabase,
  getAllLeaves,
  deleteLeave,
} = require("../models/leave"); // Assuming the file is named leave.js
require("dotenv").config();

const router = express.Router();

function handleError(err, res) {
  console.error(err);
  res.status(500).json({ message: "Internal server error" });
}

router.post("/add_leave", validateToken, checkManagerRole, async (req, res) => {
  const { employee_id, leave_type_id, start_date, end_date, loc_id } = req.body;
  console.log("loc_id" + loc_id);

  // Validation (optional)
  if (!employee_id || !leave_type_id || !start_date || !end_date) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  // Check for existing leave
  const existingLeave = await findLeaveByArmyNo(
    employee_id.value,
    start_date,
    end_date
  );
  if (existingLeave) {
    return res.status(400).json({
      message: "Leave with same army no and start and end dates already exists",
    });
  }

  try {
    leave = await addLeaveToDatabase({
      employee_id: employee_id.value,
      leave_type_id: leave_type_id.value,
      start_date: new Date(start_date).toISOString(),
      end_date: new Date(end_date).toISOString(),
      loc_id: loc_id,
    });
    res.json({ message: "Leave created successfully", leave: leave }); // Return created leave ID
  } catch (error) {
    handleError(error, res);
  }
});
router.post("/leave_by_id", validateToken, async (req, res) => {
  const id = req.body.id;
  console.log("Finding leave!");
  try {
    const leave = await findLeaveById(id);
    if (leave) {
      res.json({ leave });
    } else {
      res.status(404).json({ message: "Leave with id: " + id + " not found." });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});
// Route for updating a leave (POST)
router.post(
  "/update_leave",
  validateToken,
  checkManagerRole,
  async (req, res) => {
    const {
      id,
      employee_id,
      leave_type_id,
      start_date,
      end_date,
      availDate,
      loc_id,
    } = req.body;

    // Check for missing fields
    if (
      !employee_id ||
      !leave_type_id ||
      !start_date ||
      !end_date ||
      !id ||
      !availDate
    ) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Find user by id
    const leave = await findLeaveById(id);
    if (!leave) {
      return res.status(404).json({ message: "Leave not found" });
    }

    try {
      // Update leave in the database (using updateLeaveInDatabase)
      await updateLeaveInDatabase(leave.id, {
        employee_id: employee_id.value,
        leave_type_id: leave_type_id.value,
        start_date: new Date(start_date),
        end_date: new Date(end_date),
        avail_till_date: new Date(availDate),
        loc_id: loc_id,
      });

      res.json({ message: "Leave updated successfully" });
    } catch (error) {
      console.error("Error updating leave:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);
router.get("/leaves_list", validateToken, async (req, res) => {
  console.log("Fetching all leaves list!");
  try {
    const leaves = await getAllLeaves();
    res.json({ leaves });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});
router.post(
  "/delete_leave",
  validateToken,
  checkManagerRole,
  async (req, res) => {
    const { id } = req.body;
    // Check for missing fields
    if (!id) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    try {
      const leaves = await deleteLeave(id);
      console.log(leaves);
      if (leaves)
        res.status(200).json({ message: "Leave deleted successfully" });
      if (!leaves)
        res.status(500).json({ message: "Leave not deleted successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);

module.exports = router;
