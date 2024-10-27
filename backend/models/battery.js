const pool = require("../db/db"); // Assuming the file is named db.js

// Function to add a battery to the MySQL database
async function addBbatteryToDatabase(battery) {
  const connection = await pool.getConnection();

  try {
    const sql = `INSERT INTO batteries (name,loc_id,capacity) VALUES (?,?,?)`;
    const [results] = await connection.execute(sql, [battery.name,battery.loc_id,battery.capacity]);
    battery.id = results.insertId; // Set the generated ID on the user object
  } catch (error) {
    console.error("Error adding battery to database:", error);
    throw error; // Re-throw the error for handling in the API route
  } finally {
    connection.release();
  }
  return battery;
}
async function findBbatteryByName(name) {
  try {
    const [rows] = await pool.query(
      "select bt.id as id, bt.name as name, bt.capacity as capacity, lc.id as loc_id,lc.name as loc_name from batteries as bt join locations as lc on bt.loc_id=lc.id WHERE bt.name = ?",
      [name]
    );
    return rows[0] || null;
  } catch (error) {
    console.error("Error finding user by name:", error);
    // You can also throw a specific error here for handling in the route handler
  }
}
async function findBbatteryById(id) {
  try {
    const [rows] = await pool.query(
      "select bt.id as id, bt.name as name, bt.capacity as capacity, lc.id as loc_id,lc.name as loc_name from batteries as bt join locations as lc on bt.loc_id=lc.id WHERE bt.id = ?",
      [id]
    );
    return rows[0] || null;
  } catch (error) {
    console.error("Error finding battery by id:", error);
    // You can also throw a specific error here for handling in the route handler
  }
}
async function getAllBbatteries() {
  try {
    const [rows] = await pool.query(
      "select bt.id as id, bt.name as name, bt.capacity as capacity, lc.id as loc_id,lc.name as loc_name from batteries as bt join locations as lc on bt.loc_id=lc.id"
    );
    console.log("fetched batteries");
    return rows;
  } catch (error) {
    console.error("Error fetching all batteries:", error);
    // You can also throw a specific error here for handling in the route handler
  }
}
async function deleteBbattery(id) {
  try {
    const sql = `DELETE FROM batteries WHERE id = ?`;
    const result = await pool.execute(sql, [id]); // Delete battery

    if (result[0].affectedRows === 0) {
      return false;
    }
    return true;
  } catch (error) {
    console.error("Error deleting batteries:", error);
    // You can also throw a specific error here for handling in the route handler
  }
}
// Function to update a battery in the MySQL database
async function updateBbatteryInDatabase(id, updatedBbattery) {
  const connection = await pool.getConnection();
  try {
    const sql = `UPDATE batteries SET name = ?,loc_id = ?, capacity = ? WHERE id = ?`;
    const [results] = await connection.execute(sql, [
      updatedBbattery.name,
      updatedBbattery.loc_id,
      updatedBbattery.capacity,
      id,
    ]);
    if (results.affectedRows === 0) {
      throw new Error("Battery not found"); // Handle case where battery wasn't updated (not found)
    }
  } catch (error) {
    console.error("Error updating battery in database:", error);
    throw error; // Re-throw the error for handling in the API route
  } finally {
    connection.release();
  }
}
module.exports = {
  addBbatteryToDatabase,
  findBbatteryByName,
  findBbatteryById,
  updateBbatteryInDatabase,
  getAllBbatteries,
  deleteBbattery,
};
