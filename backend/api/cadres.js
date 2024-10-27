const express = require("express");
const { validateToken, checkManagerRole } = require("../utils/authMiddleware"); // Assuming the file is named authMiddleware.js
const {
  addCadreToDatabase,
  findCadreByName,
  findCadreById,
  updateCadreInDatabase,
  getAllCadres,
  deleteCadre,
} = require("../models/cadre"); // Assuming the file is named cadre.js
require("dotenv").config();

const router = express.Router();

function handleError(err, res) {
  console.error(err);
  res.status(500).json({ message: "Internal server error" });
}

router.post("/add_cadre", validateToken, checkManagerRole, async (req, res) => {
  const { cadrename } = req.body;

  // Validation (optional)
  if (!cadrename) {
    return res.status(400).json({ message: "Missing required field: name" });
  }

  // Check for existing cadre
  const existingCadre = await findCadreByName(cadrename);
  if (existingCadre) {
    return res
      .status(400)
      .json({ message: "Cadre with same name already exists" });
  }

  try {
    cadre = await addCadreToDatabase({ name: cadrename });
    res.json({ message: "Trait created successfully", cadre: cadre }); // Return created cadre ID
  } catch (error) {
    handleError(error, res);
  }
});
// Route for updating a cadre (POST)
router.post(
  "/update_cadre",
  validateToken,
  checkManagerRole,
  async (req, res) => {
    const { id, cadrename } = req.body;

    // Check for missing fields
    if (!cadrename || !id) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Find user by id
    const cadre = await findCadreById(id);
    if (!cadre) {
      return res.status(404).json({ message: "Trait not found" });
    }

    try {
      // Prepare updated cadre object
      const updatedcadre = {};
      if (cadrename) cadre.name = cadrename;

      // Update cadre in the database (using updateCadreInDatabase)
      await updateCadreInDatabase(cadre.id, cadre);

      res.json({ message: "Trait updated successfully" });
    } catch (error) {
      console.error("Error updating cadre:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);
router.post("/cadre_by_id", validateToken, async (req, res) => {
  const id = req.body.id;
  console.log("Finding cadre!");
  try {
    const cadre = await findCadreById(id);
    if (cadre) {
      res.json({ cadre });
    } else {
      res.status(404).json({ message: "Trait with id: " + id + " not found." });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});
router.get("/cadres_list", validateToken, async (req, res) => {
  console.log("Fetching all traits list!");
  try {
    const cadres = await getAllCadres();
    res.json({ cadres });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});
router.post(
  "/delete_cadre",
  validateToken,
  checkManagerRole,
  async (req, res) => {
    const id = req.body.id;

    // Check for missing fields
    if (!id) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    try {
      const cadres = await deleteCadre(id);
      console.log(cadres);
      if (cadres)
        res.status(200).json({ message: "Cadre deleted successfully" });
      if (!cadres)
        res.status(500).json({ message: "Cadre not deleted successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);

module.exports = router;
