const express = require("express");
const { validateToken, checkManagerRole } = require("../utils/authMiddleware"); // Assuming the file is named authMiddleware.js
const {
  addLocationToDatabase,
  findLocationByName,
  findLocationById,
  updateLocationInDatabase,
  getAllLocations,
  deleteLocation,
} = require("../models/location"); // Assuming the file is named location.js
require("dotenv").config();

const router = express.Router();

function handleError(err, res) {
  console.error(err);
  res.status(500).json({ message: "Internal server error" });
}

router.post("/add_location", validateToken, checkManagerRole, async (req, res) => {
  const { locationName, description, capacity } = req.body;

  // Validation (optional)
  if (!locationName || !description || !capacity) {
    return res
      .status(400)
      .json({ message: "Missing required fields." });
  }

  // Check for existing location
  const existingLocation = await findLocationByName(locationName);
  if (existingLocation) {
    return res
      .status(400)
      .json({ message: "Location with same name already exists" });
  }

  try {
    location = await addLocationToDatabase({ name: locationName, description: description, capacity: capacity });
    res.json({ message: "Location created successfully", location: location }); // Return created location ID
  } catch (error) {
    handleError(error, res);
  }
});
router.post("/location_by_id", validateToken, async (req, res) => {
  const id = req.body.id;
  console.log("Finding location!");
  try {
    const location = await findLocationById(id);
    if (location) {
      res.json({ location });
    } else {
      res.status(404).json({ message: "Location with id: " + id + " not found." });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});
// Route for updating a location (POST)
router.post(
  "/update_location",
  validateToken,
  checkManagerRole,
  async (req, res) => {
    const { id, locationName, description, capacity } = req.body;

    // Check for missing fields
    if (!locationName || !id || !description || !capacity) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Find user by id
    const location = await findLocationById(id);
    if (!location) {
      return res.status(404).json({ message: "Location not found" });
    }

    try {
      // Prepare updated location object
      const updatedlocation = {};
      if (locationName) updatedlocation.name = locationName;
      if (description) updatedlocation.description = description;
      if (capacity) updatedlocation.capacity = capacity;

      // Update location in the database (using updateLocationInDatabase)
      await updateLocationInDatabase(location.id, updatedlocation);

      res.json({ message: "Location updated successfully" });
    } catch (error) {
      console.error("Error updating location:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);
router.get("/locations_list", validateToken, async (req, res) => {
  console.log("Fetching all locations list!");
  try {
    const locations = await getAllLocations();
    res.json({ locations });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});
router.post(
  "/delete_location",
  validateToken,
  checkManagerRole,
  async (req, res) => {
    const { id } = req.body;
    // Check for missing fields
    if (!id) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    try {
      const locations = await deleteLocation(id);
      console.log(locations);
      if (locations)
        res.status(200).json({ message: "Location deleted successfully" });
      if (!locations)
        res.status(500).json({ message: "Location not deleted successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);

module.exports = router;
