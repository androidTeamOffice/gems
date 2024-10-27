const express = require("express");
const { validateToken } = require("../utils/authMiddleware"); // Assuming the file is named authMiddleware.js
const {
  addNokInfo,
  findNokInfoByArmyNo,
  findNokInfoById,
  updateNokInfo,
  deleteNokInfo,
  findNokInfoByArmyNoAndName,
  getAllNokInfos,
  getAllNokInfosByArmyNos,
} = require("../models/nokInfo"); // Assuming the file is named nokInfo.js

const router = express.Router();

function handleError(err, res) {
  console.error(err);
  res.status(500).json({ message: "Internal server error" });
}

// Route for adding NOK info (POST)
router.post("/add_nok_info", validateToken, async (req, res) => {
  const { armyNo, nok_name, relation, address, contactNo } = req.body; // Assuming nokInfo object in request body

  // Validation (optional)

  // Check for missing fields
  if (!armyNo || !nok_name || !relation || !address || !contactNo) {
    return res.status(400).json({ message: "Missing required fields" });
  }
  const nokInfo = await findNokInfoByArmyNoAndName(armyNo.value, nok_name);
  console.log("nokInfo " + nokInfo);
  if (nokInfo != null) {
    res.status(400).json({
      message:
        "NOK information with same name already exists for " + armyNo.value,
    });
  } else {
    try {
      await addNokInfo({
        army_no: armyNo.value,
        name: nok_name,
        relation: relation,
        address: address,
        contact_no: contactNo,
      });
      res.json({ message: "NOK information added successfully" });
    } catch (error) {
      handleError(error, res);
    }
  }
});

// Route for getting NOK info by army No (POST)
router.post("/nok_info_by_army_no", validateToken, async (req, res) => {
  const { armyNo } = req.body;

  try {
    const nokInfo = await findNokInfoByArmyNo(armyNo);
    if (nokInfo) {
      res.json({ nokInfo });
    } else {
      res
        .status(404)
        .json({ message: "NOK information not found for army No: " + armyNo });
    }
  } catch (error) {
    handleError(error, res);
  }
});

// Route for getting NOK info by ID (POST)
router.post("/nok_info_by_id", validateToken, async (req, res) => {
  const { id } = req.body;

  try {
    const nokInfo = await findNokInfoById(id);
    if (nokInfo) {
      res.json({ nokInfo });
    } else {
      res
        .status(404)
        .json({ message: "NOK information not found with id: " + id });
    }
  } catch (error) {
    handleError(error, res);
  }
});

// Route for updating NOK info (POST)
router.post("/update_nok_info", validateToken, async (req, res) => {
  const { id, armyNo, nok_name, relation, address, contactNo } = req.body;
  console.log("id " + id);
  console.log("id " + armyNo);
  console.log("id " + nok_name);
  console.log("id " + relation);
  console.log("id " + address);
  console.log("id " + contactNo);
  // Check for missing fields
  if (!id || !armyNo || !nok_name || !relation || !address || !contactNo) {
    return res.status(400).json({ message: "Missing required fields" });
  }
  const nokInfo = await findNokInfoById(id);
  if (!nokInfo) {
    res
      .status(404)
      .json({ message: "NOK information not found with id: " + id });
  }

  try {
    await updateNokInfo(nokInfo.id, {
      army_no: armyNo.value,
      name: nok_name,
      relation: relation,
      address: address,
      contact_no: contactNo,
    });
    res.json({ message: "NOK information updated successfully" });
  } catch (error) {
    handleError(error, res);
  }
});

// Route for deleting NOK info (POST)
router.post("/delete_nok_info", validateToken, async (req, res) => {
  const { id } = req.body;

  // Check for missing fields
  if (!id) {
    return res.status(400).json({ message: "Missing required field: id" });
  }

  try {
    const deleted = await deleteNokInfo(id);
    if (deleted) {
      res.status(200).json({ message: "NOK information deleted successfully" });
    } else {
      res
        .status(404)
        .json({ message: "NOK information not found or deletion failed" });
    }
  } catch (error) {
    handleError(error, res);
  }
});
router.get("/nok_infos_list", validateToken, async (req, res) => {
  console.log("Fetching all nok infos list!");
  try {
    const noks = await getAllNokInfos();
    res.json({ noks });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});
router.post("/nok_infos_by_armynos_list", validateToken, async (req, res) => {
  console.log("Fetching all nok infos by army nos list!");
  const { armyNos } = req.body;
  try {
    const noks = await getAllNokInfosByArmyNos(armyNos);
    res.json({ noks });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});
module.exports = router;
