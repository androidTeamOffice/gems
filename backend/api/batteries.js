const express = require("express");
const { validateToken, checkManagerRole } = require("../utils/authMiddleware"); // Assuming the file is named authMiddleware.js
const {
  addBbatteryToDatabase,
  findBbatteryById,
  findBbatteryByName,
  updateBbatteryInDatabase,
  getAllBbatteries,
  deleteBbattery,
} = require("../models/battery"); // Assuming the file is named battery.js
require("dotenv").config();

const router = express.Router();

function handleError(err, res) {
  console.error(err);
  res.status(500).json({ message: "Internal server error" });
}

router.post(
  "/add_battery",
  validateToken,
  checkManagerRole,
  async (req, res) => {
    const { batteryname, capacity, locationId } = req.body;

    // Validation (optional)
    if (!batteryname) {
      return res
        .status(400)
        .json({ message: "Missing required field: batteryname" });
    }

    // Check for existing battery
    const existingBattery = await findBbatteryByName(batteryname);
    if (existingBattery) {
      return res
        .status(400)
        .json({ message: "Battery with same name already exists" });
    }

    try {
      console.log(
        "B Name: " +
          batteryname +
          " loc_id " +
          locationId.value +
          " capacity " +
          capacity
      );
      battery = await addBbatteryToDatabase({
        name: batteryname,
        loc_id: locationId.value,
        capacity: capacity,
      });
      res.json({ message: "Battery created successfully", battery: battery }); // Return created battery ID
    } catch (error) {
      handleError(error, res);
    }
  }
);
router.post("/battery_by_id", validateToken, async (req, res) => {
  const id = req.body.id;
  console.log("Finding battery!");
  try {
    const battery = await findBbatteryById(id);
    if (battery) {
      res.json({ battery });
    } else {
      res
        .status(404)
        .json({ message: "Battery with id: " + id + " not found." });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});
// Route for updating a battery (POST)
router.post(
  "/update_battery",
  validateToken,
  checkManagerRole,
  async (req, res) => {
    const { id, batteryname, capacity, locationId } = req.body;

    // Check for missing fields
    if (!batteryname || !id) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Find user by id
    const battery = await findBbatteryById(id);
    if (!battery) {
      return res.status(404).json({ message: "Battery not found" });
    }

    try {
      // Prepare updated battery object
      const updatedbattery = {};
      if (batteryname) updatedbattery.name = batteryname;
      if (locationId) updatedbattery.loc_id = locationId.value;
      if (capacity) updatedbattery.capacity = capacity;
     

      // Update battery in the database (using updateBatteryInDatabase)
      await updateBbatteryInDatabase(id, updatedbattery);
      console.log(id, update_battery)

      res.json({ message: "Battery updated successfully" });
    } catch (error) {
      console.error("Error updating battery:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);
router.get("/batteries_list", validateToken, async (req, res) => {
  console.log("Fetching all batterys list!");
  try {
    const batterys = await getAllBbatteries();
    res.json({ batterys });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});
router.post(
  "/delete_battery",
  validateToken,
  checkManagerRole,
  async (req, res) => {
    const { id } = req.body;
    // Check for missing fields
    if (!id) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    try {
      const batterys = await deleteBbattery(id);
      console.log(batterys);
      if (batterys)
        res.status(200).json({ message: "Battery deleted successfully" });
      if (!batterys)
        res.status(500).json({ message: "Battery not deleted successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);

module.exports = router;