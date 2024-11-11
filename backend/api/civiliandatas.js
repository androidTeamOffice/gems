const express = require("express");
const { validateToken, checkManagerRole } = require("../utils/authMiddleware"); // Assuming the file is named authMiddleware.js
const {
  addCivDataToDatabase,
  findCivDataByName,
  findCivDataById,
  updateCivDataInDatabase,
  getAllCivDatas,
  getAllVerifiedCivDatas,
  deleteCivData,
  rejectCivData,
  verifyCivData,
} = require("../models/civiliandata"); // Assuming the file is named civData.js
require("dotenv").config();

const router = express.Router();

function handleError(err, res) {
  console.error(err);
  res.status(500).json({ message: "Internal server error" });
}

router.post("/add_civData", validateToken, checkManagerRole, async (req, res) => {
  const { name,cnic,status,type } = req.body;//TODO: your furhter civ data parameters...

  // Validation (optional)
  if (!name||!cnic||!status||!type) {
    return res
      .status(400)
      .json({ message: "Missing required fields" });
  }

  // Check for existing civData
  const existingCivData = await findCivDataByName(cnic);//TODO: correct function name to findCivDataByCNIC
  if (existingCivData) {
    return res
      .status(400)
      .json({ message: "Civdatas with same cnic already exists" });
  }

  try {
    civData = await addCivDataToDatabase({ name: civDataname });
    res.json({ message: "Civdatas created successfully", civData: civData }); // Return created civData ID
  } catch (error) {
    handleError(error, res);
  }
});
router.post("/civData_by_id", validateToken, async (req, res) => {
  const id = req.body.id;
  console.log("Finding civData!");
  try {
    const civData = await findCivDataById(id);
    if (civData) {
      res.json({ civData });
    } else {
      res.status(404).json({ message: "Civdatas with id: " + id + " not found." });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});
// Route for updating a civData (POST)
router.post(
  "/update_civData",
  validateToken,
  checkManagerRole,
  async (req, res) => {
    const { id, civDataname } = req.body;

    // Check for missing fields
    if (!civDataname || !id) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Find user by id
    const civData = await findCivDataById(id);
    if (!civData) {
      return res.status(404).json({ message: "Civdatas not found" });
    }

    try {
      // Prepare updated civData object
      const updatedcivData = {};
      if (civDataname) civData.name = civDataname;

      // Update civData in the database (using updateCivDataInDatabase)
      await updateCivDataInDatabase(civData.id, civData);

      res.json({ message: "Civdatas updated successfully" });
    } catch (error) {
      console.error("Error updating civData:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);
router.get("/civilian_data_for_verification_list", validateToken, async (req, res) => {
  console.log("Fetching all civDatas list!");
  try {
    const civDatas = await getAllCivDatas();
    res.json({ civDatas });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});
router.get("/civilian_data_verified_list", validateToken, async (req, res) => {
  console.log("Fetching all civDatas list!");
  try {
    const civDatas = await getAllVerifiedCivDatas();
    res.json({ civDatas });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});
router.post(
  "/delete_civData",
  validateToken,
  checkManagerRole,
  async (req, res) => {
    const { id } = req.body;
    // Check for missing fields
    if (!id) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    try {
      const civDatas = await deleteCivData(id);
      console.log(civDatas);
      if (civDatas) res.status(200).json({ message: "Civdatas deleted successfully" });
      if (!civDatas)
        res.status(500).json({ message: "Civdatas not deleted successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);
router.post(
  "/reject_civdata",
  validateToken,
  checkManagerRole,
  async (req, res) => {
    const { id,remarks } = req.body;
    // Check for missing fields
    if (!id||!remarks) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    try {
      const civDatas = await rejectCivData(id,remarks);
      console.log(civDatas);
      if (civDatas) res.status(200).json({ message: "Civdatas rejected successfully" });
      if (!civDatas)
        res.status(500).json({ message: "Civdatas not rejected successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);
router.post(
  "/verify_civData",
  validateToken,
  checkManagerRole,
  async (req, res) => {
    const { id } = req.body;
    // Check for missing fields
    if (!id) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    try {
      const civDatas = await verifyCivData(id);
      console.log(civDatas);
      if (civDatas) res.status(200).json({ message: "Civdatas verified successfully" });
      if (!civDatas)
        res.status(500).json({ message: "Civdatas not verified successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);

module.exports = router;
