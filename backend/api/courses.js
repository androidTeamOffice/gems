const express = require("express");
const { validateToken, checkManagerRole } = require("../utils/authMiddleware"); // Assuming the file is named authMiddleware.js
const {
  addCourseToDatabase,
  findCourseByName,
  findCourseById,
  updateCourseInDatabase,
  getAllCourses,
  deleteCourse,
} = require("../models/course"); // Assuming the file is named course.js
require("dotenv").config();

const router = express.Router();

function handleError(err, res) {
  console.error(err);
  res.status(500).json({ message: "Internal server error" });
}

router.post(
  "/add_course",
  validateToken,
  checkManagerRole,
  async (req, res) => {
    const { coursename, for_cadre, details } = req.body;

    // Validation (optional)
    if (!coursename || !for_cadre || !details) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Check for existing course
    const existingCourse = await findCourseByName(coursename);
    if (existingCourse) {
      return res
        .status(400)
        .json({ message: "Course with same name already exists" });
    }

    try {
      course = await addCourseToDatabase({
        name: coursename,
        for_cadre: for_cadre.value,
        details: details,
      });
      res.json({ message: "Course created successfully", course: course }); // Return created course ID
    } catch (error) {
      handleError(error, res);
    }
  }
);
router.post("/course_by_id", validateToken, async (req, res) => {
  const id = req.body.id;
  console.log("Finding course!");
  try {
    const course = await findCourseById(id);
    if (course) {
      res.json({ course });
    } else {
      res
        .status(404)
        .json({ message: "Course with id: " + id + " not found." });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});
// Route for updating a course (POST)
router.post(
  "/update_course",
  validateToken,
  checkManagerRole,
  async (req, res) => {
    const { id, coursename, for_cadre, details } = req.body;

    // Check for missing fields
    if (!coursename || !id || !for_cadre || !details) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Find user by id
    const course = await findCourseById(id);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    try {
      // Prepare updated course object
      const updatedcourse = {};
      if (coursename) course.name = coursename;
      if (for_cadre) course.for_cadre = for_cadre.value;
      if (details) course.details = details;

      // Update course in the database (using updateCourseInDatabase)
      await updateCourseInDatabase(course.id, course);

      res.json({ message: "Course updated successfully" });
    } catch (error) {
      console.error("Error updating course:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);
router.get("/courses_list", validateToken, async (req, res) => {
  console.log("Fetching all courses list!");
  try {
    const courses = await getAllCourses();
    res.json({ courses });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});
router.post(
  "/delete_course",
  validateToken,
  checkManagerRole,
  async (req, res) => {
    const { id } = req.body;
    // Check for missing fields
    if (!id) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    try {
      const courses = await deleteCourse(id);
      console.log(courses);
      if (courses)
        res.status(200).json({ message: "Course deleted successfully" });
      if (!courses)
        res.status(500).json({ message: "Course not deleted successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);

module.exports = router;
