const express = require("express");
const {
  addEmployee,
  findEmployeeById,
  findEmployeeByNameAndArmyNo,
  findEmployees,
  updateEmployee,
  deleteEmployee,
} = require("../models/employee"); // Assuming the file is named employee.js

const router = express.Router();

// Route for adding a new employee (POST)
router.post("/add_employee", async (req, res) => {
  const {
    indlName,
    trade,
    rank,
    medicalCategory,
    armyNo,
    loc_id,
    available,
    remarks,
  } = req.body;
  if (
    !indlName ||
    !trade ||
    !rank ||
    !medicalCategory ||
    !armyNo ||
    !loc_id ||
    !available
  ) {
    return res.status(400).json({ message: "Missing required fields." });
  }

  // Check for existing rank
  const existingEmp = await findEmployeeByNameAndArmyNo(indlName, armyNo.value);
  if (existingEmp) {
    return res
      .status(400)
      .json({ message: "Employee with same Name and Army No already exists" });
  }

  try {
    const newEmployeeId = await addEmployee({
      employee_name: indlName,
      cadreId: trade.value,
      rankId: rank.value,
      medicalStatusId: medicalCategory.value,
      armyNo: armyNo.value,
      loc_id: loc_id.value,
      available: available.value,
      remarks: remarks,
    });
    res.json({ message: "Employee added successfully", id: newEmployeeId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error adding employee" });
  }
});

// Route for getting employee by ID (POST)
router.post("/employee_by_id", async (req, res) => {
  const { id } = req.body;

  try {
    const employee = await findEmployeeById(id);
    if (employee) {
      res.json({ employee });
    } else {
      res.status(404).json({ message: "Employee not found with id: " + id });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error finding employee" });
  }
});

// Route for getting all employees (GET)
router.get("/employees", async (req, res) => {
  try {
    const employees = await findEmployees();
    res.json({ employees });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error finding employees" });
  }
});

// Route for updating employee (POST)
router.post("/update_employee", async (req, res) => {
  const {
    id,
    indlName,
    trade,
    rank,
    medicalCategory,
    armyNo,
    loc_id,
    available,
    remarks,
  } = req.body;
  if (
    !indlName ||
    !trade ||
    !rank ||
    !medicalCategory ||
    !armyNo ||
    !loc_id ||
    !available
  ) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const updated = await updateEmployee(id, {
      employee_name: indlName,
      cadreId: trade,
      rankId: rank,
      medicalStatusId: medicalCategory.value,
      armyNo: armyNo,
      loc_id: loc_id.value,
      available: available.value,
      remarks: remarks,
    });
    if (updated) {
      res.json({ message: "Employee updated successfully" });
    } else {
      res.status(404).json({ message: "Employee not found or update failed" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating employee" });
  }
});

// Route for deleting employee (POST)
router.post("/delete_employee", async (req, res) => {
  const { id } = req.body;

  // Check for missing fields
  if (!id) {
    return res.status(400).json({ message: "Missing required field: id" });
  }

  try {
    const deleted = await deleteEmployee(id);
    if (deleted) {
      res.status(200).json({ message: "Employee deleted successfully" });
    } else {
      res
        .status(404)
        .json({ message: "Employee not found or deletion failed" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error deleting employee" });
  }
});

module.exports = router;
