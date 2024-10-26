const express = require("express");
const { validateToken, checkManagerRole } = require("../utils/authMiddleware"); // Assuming the file is named authMiddleware.js
const {
  addRankToDatabase,
  findRankByName,
  findRankById,
  updateRankInDatabase,
  getAllRanks,
  deleteRank,
} = require("../models/rank"); // Assuming the file is named rank.js
require("dotenv").config();

const router = express.Router();

function handleError(err, res) {
  console.error(err);
  res.status(500).json({ message: "Internal server error" });
}

router.post("/add_rank", validateToken, checkManagerRole, async (req, res) => {
  const { rankname } = req.body;

  // Validation (optional)
  if (!rankname) {
    return res
      .status(400)
      .json({ message: "Missing required field: rankname" });
  }

  // Check for existing rank
  const existingRank = await findRankByName(rankname);
  if (existingRank) {
    return res
      .status(400)
      .json({ message: "Rank with same name already exists" });
  }

  try {
    rank = await addRankToDatabase({ name: rankname });
    res.json({ message: "Rank created successfully", rank: rank }); // Return created rank ID
  } catch (error) {
    handleError(error, res);
  }
});
router.post("/rank_by_id", validateToken, async (req, res) => {
  const id = req.body.id;
  console.log("Finding rank!");
  try {
    const rank = await findRankById(id);
    if (rank) {
      res.json({ rank });
    } else {
      res.status(404).json({ message: "Rank with id: " + id + " not found." });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});
// Route for updating a rank (POST)
router.post(
  "/update_rank",
  validateToken,
  checkManagerRole,
  async (req, res) => {
    const { id, rankname } = req.body;

    // Check for missing fields
    if (!rankname || !id) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Find user by id
    const rank = await findRankById(id);
    if (!rank) {
      return res.status(404).json({ message: "Rank not found" });
    }

    try {
      // Prepare updated rank object
      const updatedrank = {};
      if (rankname) rank.name = rankname;

      // Update rank in the database (using updateRankInDatabase)
      await updateRankInDatabase(rank.id, rank);

      res.json({ message: "Rank updated successfully" });
    } catch (error) {
      console.error("Error updating rank:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);
router.get("/ranks_list", validateToken, async (req, res) => {
  console.log("Fetching all ranks list!");
  try {
    const ranks = await getAllRanks();
    res.json({ ranks });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});
router.post(
  "/delete_rank",
  validateToken,
  checkManagerRole,
  async (req, res) => {
    const { id } = req.body;
    // Check for missing fields
    if (!id) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    try {
      const ranks = await deleteRank(id);
      console.log(ranks);
      if (ranks) res.status(200).json({ message: "Rank deleted successfully" });
      if (!ranks)
        res.status(500).json({ message: "Rank not deleted successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);

module.exports = router;
