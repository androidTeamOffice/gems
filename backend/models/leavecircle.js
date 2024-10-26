const pool = require("../db/db"); // Assuming the file is named db.js
const bcrypt = require("bcryptjs");

async function findLeaveCircleByName(circleName) {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM lve_circles WHERE name = ?",
      [circleName]
    );
    return rows[0] || null;
  } catch (error) {
    console.error("Error finding user by circleName:", error);
    // You can also throw a specific error here for handling in the route handler
  }
}
async function findLeaveCircleById(id) {
  try {
    const [rows] = await pool.query("SELECT * FROM lve_circles WHERE id = ?", [
      id,
    ]);
    return rows[0] || null;
  } catch (error) {
    console.error("Error finding user by id:", error);
    // You can also throw a specific error here for handling in the route handler
  }
}

async function getAllLeaveCircles() {
  try {
    const [rows] = await pool.query("SELECT * FROM lve_circles");
    console.log("fetched");
    return rows;
  } catch (error) {
    console.error("Error fetching all lve_circles:", error);
    // You can also throw a specific error here for handling in the route handler
  }
}

// Example function to add a user to the MySQL database
async function addLeaveCircleToDatabase(leaveCircle) {
  const connection = await pool.getConnection();
  try {
    const sql = `INSERT INTO lve_circles (name, distance, lveGt) VALUES (?, ?, ?)`;
    const [results] = await connection.execute(sql, [
      leaveCircle.circleName,
      leaveCircle.distance,
      leaveCircle.lveGrant,
    ]);
    leaveCircle.id = results.insertId;
  } catch (error) {
    console.error("Error adding Circle to database:", error);
    throw error; // Re-throw the error for handling in the API route
  } finally {
    connection.release();
  }
  return leaveCircle;
}
// Example function to update a user in the MySQL database
async function updateLeaveCircleInDatabase(id, updatedLeaveCircle) {
  const connection = await pool.getConnection();
  try {
    const sql = `UPDATE lve_circles SET name = ?, distance = ?, lveGt = ? WHERE id = ?`;
    const [results] = await connection.execute(sql, [
      updatedLeaveCircle.name,
      updatedLeaveCircle.distance,
      updatedLeaveCircle.lveGt,
      id,
    ]);
    if (results.affectedRows === 0) {
      throw new Error("Leave Circle not found"); // Handle case where user wasn't updated (not found)
    }
  } catch (error) {
    console.error("Error updating leave Circle in database:", error);
    throw error; // Re-throw the error for handling in the API route
  } finally {
    connection.release();
  }
}
async function deleteLeaveCircle(id) {
  try {
    const sql = `DELETE FROM lve_circles WHERE id = ?`;
    const result = await pool.execute(sql, [id]); // Delete duty

    if (result[0].affectedRows === 0) {
      return false;
    }
    return true;
  } catch (error) {
    console.error("Error deleting user:", error);
    // You can also throw a specific error here for handling in the route handler
  }
}
module.exports = {
  getAllLeaveCircles,
  findLeaveCircleByName,

  addLeaveCircleToDatabase,
  updateLeaveCircleInDatabase,
  findLeaveCircleById,
  deleteLeaveCircle,
};
