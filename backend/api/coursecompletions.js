const express = require("express");
const { validateToken, checkManagerRole } = require("../utils/authMiddleware"); // Assuming the file is named authMiddleware.js
const {
  addCourseCompletionToDatabase,
  findCourseCompletionByArmyNoAndCourse,
  findCourseCompletionById,
  updateCourseCompletionInDatabase,
  getAllCourseCompletions,
  deleteCourseCompletion,
} = require("../models/coursecompletion"); // Assuming the file is named courseCompletion.js
require("dotenv").config();

const router = express.Router();

function handleError(err, res) {
  console.error(err);
  res.status(500).json({ message: "Internal server error" });
}

router.post(
  "/add_course_completion",
  validateToken,
  checkManagerRole,
  async (req, res) => {
    const {
      army_no,
      course_id,
      course_serial,
      course_from,
      course_to,
      institution,
      course_status,
      remarks,
      grade,
    } = req.body;

    // Validation (optional)
    if (
      !army_no ||
      !course_id ||
      !course_serial ||
      !course_status ||
      !course_from ||
      !course_to ||
      !institution
    ) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Check for existing courseCompletion
    const existingRank = await findCourseCompletionByArmyNoAndCourse(
      army_no.value,
      course_id.value
    );
    if (existingRank) {
      return res.status(400).json({
        message: "Course Completion with same army no, course already exists",
      });
    }

    try {
      courseCompletion = await addCourseCompletionToDatabase({
        army_no: army_no.value,
        course_id: course_id.value,
        course_status: course_status.value,
        course_serial: course_serial,
        course_from: course_from,
        course_to: course_to,
        institution: institution,
        remarks: remarks,
        grade: grade,
      });
      res.json({
        message: "Course Completion created successfully",
        courseCompletion: courseCompletion,
      }); // Return created courseCompletion ID
    } catch (error) {
      handleError(error, res);
    }
  }
);
router.post("/course_completion_by_id", validateToken, async (req, res) => {
  const id = req.body.id;
  console.log("Finding courseCompletion!");
  try {
    const courseCompletion = await findCourseCompletionById(id);
    if (courseCompletion) {
      res.json({ courseCompletion });
    } else {
      res
        .status(404)
        .json({ message: "Course Completion with id: " + id + " not found." });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});
// Route for updating a courseCompletion (POST)
router.post(
  "/update_course_completion",
  validateToken,
  checkManagerRole,
  async (req, res) => {
    const {
      id,
      army_no,
      course_id,
      course_serial,
      course_from,
      course_to,
      institution,
      course_status,
      remarks,
      grade,
    } = req.body;

    // Check for missing fields
    if (
      !id ||
      !army_no ||
      !course_id ||
      !course_serial ||
      !course_status ||
      !course_from ||
      !course_to ||
      !institution ||
      !remarks
    ) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Find user by id
    const courseCompletion = await findCourseCompletionById(id);
    if (!courseCompletion) {
      return res.status(404).json({ message: "Course Completion not found" });
    }

    try {
      // Update courseCompletion in the database (using updateRankInDatabase)
      await updateCourseCompletionInDatabase(courseCompletion.id, {
        army_no: army_no.value,
        course_id: course_id.value,
        course_status: course_status.value,
        course_serial: course_serial,
        course_from: course_from,
        course_to: course_to,
        institution: institution,
        remarks: remarks,
        grade: grade,
      });

      res.json({ message: "Course Completion updated successfully" });
    } catch (error) {
      console.error("Error updating Course Completion:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);
router.get("/course_completions_list", validateToken, async (req, res) => {
  console.log("Fetching all Course Completions list!");
  try {
    const course_completion = await getAllCourseCompletions();
    res.json({ course_completion });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});
router.post(
  "/delete_course_completion",
  validateToken,
  checkManagerRole,
  async (req, res) => {
    const { id } = req.body;
    // Check for missing fields
    if (!id) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    try {
      const ranks = await deleteCourseCompletion(id);
      console.log(ranks);
      if (ranks)
        res
          .status(200)
          .json({ message: "Course Completion deleted successfully" });
      if (!ranks)
        res
          .status(500)
          .json({ message: "Course Completion not deleted successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);

module.exports = router;
