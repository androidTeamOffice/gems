const express = require("express");
const { validateToken, checkManagerRole } = require("../utils/authMiddleware"); // Assuming the file is named authMiddleware.js
const {
  addContactAddress,
  findContactAddressBySoldierId,
  getAllContacts,
  updateContactAddress,
  deleteContactAddress,
  getAllContactsByArmyNos,
} = require("../models/contactAddress"); // Assuming the file is named contactAddress.js

const router = express.Router();

function handleError(err, res) {
  console.error(err);
  res.status(500).json({ message: "Internal server error" });
}

// Route for adding contact address (POST)
router.post("/add_contact_address", validateToken, async (req, res) => {
  const { armyNo, village, PO, Teh, Dist, contactNo } = req.body; // Destructuring all fields

  // Validation (optional)

  // You can add validation for required fields here, for example:
  if (!armyNo || !village || !contactNo || !PO || !Teh || !Dist) {
    // Assuming soldier_id, Vill, and Contact_No are required
    return res.status(400).json({ message: "Missing required fields" });
  }

  const newContactAddress = {
    soldier_id: armyNo.value,
    Vill: village,
    P_O: PO,
    Teh,
    Dist,
    Contact_No: contactNo,
  };
  try {
    await addContactAddress(newContactAddress);
    res.json({ message: "Contact address created successfully" });
  } catch (error) {
    handleError(error, res);
  }
});

// Route for getting contact address by soldier ID (POST)
router.post(
  "/contact_address_by_soldier_id",
  validateToken,
  async (req, res) => {
    const { soldierId } = req.body;

    try {
      const contactAddress = await findContactAddressBySoldierId(soldierId);
      if (contactAddress) {
        res.json({ contactAddress });
      } else {
        res.status(404).json({
          message: "Contact address not found for soldier ID: " + soldierId,
        });
      }
    } catch (error) {
      handleError(error, res);
    }
  }
);

// Route for getting contact address by ID (POST)
router.post("/contact_address_by_id", validateToken, async (req, res) => {
  const { id } = req.body;

  try {
    const contactAddress = await findContactAddressById(id);
    if (contactAddress) {
      res.json({ contactAddress });
    } else {
      res
        .status(404)
        .json({ message: "Contact address not found with id: " + id });
    }
  } catch (error) {
    handleError(error, res);
  }
});

// Route for updating contact address (POST)
router.post("/update_contact_address", validateToken, async (req, res) => {
  const { armyNo, village, PO, Teh, Dist, contactNo } = req.body; // Destructuring all fields

  // Check for missing fields
  if (!armyNo || !village || !contactNo || !PO || !Teh || !Dist) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const updatedContactAddress = {
      Vill: village,
      P_O: PO,
      Teh,
      Dist,
      Contact_No: contactNo,
    };
    await updateContactAddress(armyNo.value, updatedContactAddress);
    res.json({ message: "Contact address updated successfully" });
  } catch (error) {
    handleError(error, res);
  }
});

// Route for deleting contact address (POST)
router.post(
  "/delete_contact_address",
  validateToken,
  checkManagerRole,
  async (req, res) => {
    const { id } = req.body;

    // Check for missing fields
    if (!id) {
      return res.status(400).json({ message: "Missing required field: id" });
    }

    try {
      const deleted = await deleteContactAddress(id);
      if (deleted) {
        res
          .status(200)
          .json({ message: "Contact address deleted successfully" });
      } else {
        res
          .status(404)
          .json({ message: "Contact address not found or deletion failed" });
      }
    } catch (error) {
      handleError(error, res);
    }
  }
);
router.get("/contacts_list", validateToken, async (req, res) => {
  console.log("Fetching all contacts list!");
  try {
    const contacts = await getAllContacts();
    res.json({ contacts });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});
router.post("/contacts_by_armynos_list", validateToken, async (req, res) => {
  const { armyNos } = req.body;
  console.log("Fetching all contacts  by armynos list!");
  try {
    const contacts = await getAllContactsByArmyNos(armyNos);
    res.json({ contacts });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});
module.exports = router;
