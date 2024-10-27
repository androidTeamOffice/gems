const express = require("express");
const { validateToken, checkManagerRole } = require("../utils/authMiddleware"); // Assuming the file is named authMiddleware.js
const {
  addMedicalstatusToDatabase,
  findMedicalstatusByName,
  findMedicalstatusById,
  updateMedicalstatusInDatabase,
  getAllMedicalstatuses,
  deleteMedicalstatus,
} = require("../models/medicalstatus"); // Assuming the file is named medicalstatus.js
require("dotenv").config();

const router = express.Router();

function handleError(err, res) {
  console.error(err);
  res.status(500).json({ message: "Internal server error" });
}

router.post(
  "/add_medicalstatus",
  validateToken,
  checkManagerRole,
  async (req, res) => {
    const { medicalStatusName } = req.body;

    // Validation (optional)
    if (!medicalStatusName) {
      return res
        .status(400)
        .json({ message: "Missing required field: medicalStatusName" });
    }

    // Check for existing medicalstatus
    const existingMedicalstatus = await findMedicalstatusByName(
      medicalStatusName
    );
    if (existingMedicalstatus) {
      return res
        .status(400)
        .json({ message: "Medicalstatus with same name already exists" });
    }

    try {
      medicalstatus = await addMedicalstatusToDatabase({
        name: medicalStatusName,
      });
      res.json({
        message: "Medicalstatus created successfully",
        medicalstatus: medicalstatus,
      }); // Return created medicalstatus ID
    } catch (error) {
      handleError(error, res);
    }
  }
);
router.post("/medicalstatus_by_id", validateToken, async (req, res) => {
  const id = req.body.id;
  console.log("Finding medicalstatus!");
  try {
    const medicalstatus = await findMedicalstatusById(id);
    if (medicalstatus) {
      res.json({ medicalstatus });
    } else {
      res
        .status(404)
        .json({ message: "Medicalstatus with id: " + id + " not found." });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});
// Route for updating a medicalstatus (POST)
router.post(
  "/update_medicalstatus",
  validateToken,
  checkManagerRole,
  async (req, res) => {
    const { id, medicalStatusName } = req.body;

    // Check for missing fields
    if (!medicalStatusName || !id) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Find user by id
    const medicalstatus = await findMedicalstatusById(id);
    if (!medicalstatus) {
      return res.status(404).json({ message: "Medicalstatus not found" });
    }

    try {
      // Prepare updated medicalstatus object
      const updatedmedicalstatus = {};
      if (medicalStatusName) medicalstatus.name = medicalStatusName;

      // Update medicalstatus in the database (using updateMedicalstatusInDatabase)
      await updateMedicalstatusInDatabase(medicalstatus.id, medicalstatus);

      res.json({ message: "Medicalstatus updated successfully" });
    } catch (error) {
      console.error("Error updating medicalstatus:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);
router.get("/medicalstatuses_list", validateToken, async (req, res) => {
  console.log("Fetching all medicalstatuses list!");
  try {
    const medicalstatuses = await getAllMedicalstatuses();
    res.json({ medicalstatuses });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});
router.post(
  "/delete_medicalstatus",
  validateToken,
  checkManagerRole,
  async (req, res) => {
    const { id } = req.body;
    // Check for missing fields
    if (!id) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    try {
      const medicalstatuses = await deleteMedicalstatus(id);
      console.log(medicalstatuses);
      if (medicalstatuses)
        res.status(200).json({ message: "Medicalstatus deleted successfully" });
      if (!medicalstatuses)
        res
          .status(500)
          .json({ message: "Medicalstatus not deleted successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);

module.exports = router;
