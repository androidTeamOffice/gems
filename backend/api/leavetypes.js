const express = require("express");
const { validateToken, checkManagerRole } = require("../utils/authMiddleware"); // Assuming the file is named authMiddleware.js
const {
  addLeavetypeToDatabase,
  findLeavetypeByName,
  findLeavetypeById,
  updateLeavetypeInDatabase,
  getAllLeavetypes,
  deleteLeavetype,
} = require("../models/leavetype"); // Assuming the file is named leavetype.js
require("dotenv").config();

const router = express.Router();

function handleError(err, res) {
  console.error(err);
  res.status(500).json({ message: "Internal server error" });
}

router.post(
  "/add_leavetype",
  validateToken,
  checkManagerRole,
  async (req, res) => {
    const { leavetypename } = req.body;

    // Validation (optional)
    if (!leavetypename) {
      return res.status(400).json({ message: "Missing required field: name" });
    }

    // Check for existing leavetype
    const existingLeavetype = await findLeavetypeByName(leavetypename);
    if (existingLeavetype) {
      return res
        .status(400)
        .json({ message: "Leavetype with same name already exists" });
    }

    try {
      leavetype = await addLeavetypeToDatabase({ name: leavetypename });
      res.json({
        message: "Leavetype created successfully",
        leavetype: leavetype,
      }); // Return created leavetype ID
    } catch (error) {
      handleError(error, res);
    }
  }
);
router.post("/leavetype_by_id", validateToken, async (req, res) => {
  const id = req.body.id;
  console.log("Finding leavetype!");
  try {
    const leavetype = await findLeavetypeById(id);
    if (leavetype) {
      res.json({ leavetype });
    } else {
      res.status(404).json({ message: "Leavetype with id: " + id + " not found." });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});
// Route for updating a leavetype (POST)
router.post(
  "/update_leavetype",
  validateToken,
  checkManagerRole,
  async (req, res) => {
    const { id, leavetypename } = req.body;

    // Check for missing fields
    if (!leavetypename || !id) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Find user by id
    const leavetype = await findLeavetypeById(id);
    if (!leavetype) {
      return res.status(404).json({ message: "Leavetype not found" });
    }

    try {
      // Prepare updated leavetype object
      const updatedleavetype = {};
      if (leavetypename) leavetype.name = leavetypename;

      // Update leavetype in the database (using updateLeavetypeInDatabase)
      await updateLeavetypeInDatabase(leavetype.id, leavetype);

      res.json({ message: "Leavetype updated successfully" });
    } catch (error) {
      console.error("Error updating leavetype:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);
router.get("/leavetypes_list", validateToken, async (req, res) => {
  console.log("Fetching all leavetypes list!");

  try {
    const leavetypes = await getAllLeavetypes();
    res.json({ leavetypes });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});
router.post(
  "/delete_leavetype",
  validateToken,
  checkManagerRole,
  async (req, res) => {
    const id = req.body.id;
    console.log("Item ID" + id);
    // Check for missing fields
    if (!id) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    try {
      const leavetypes = await deleteLeavetype(id);
      console.log(leavetypes);
      if (leavetypes)
        res.status(200).json({ message: "Leavetype deleted successfully" });
      if (!leavetypes)
        res.status(500).json({ message: "Leavetype not deleted successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);

module.exports = router;
