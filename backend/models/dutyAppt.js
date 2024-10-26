const pool = require('../db/db'); // Assuming the file is named db.js

// Function to add a duty_appt to the MySQL database
async function addDutyApptToDatabase(duty_appt) {
    const connection = await pool.getConnection();
    try {
        const sql = `INSERT INTO duty_appts (name) VALUES (?)`;
        const [results] = await connection.execute(sql, [duty_appt.name]);
        duty_appt.id = results.insertId; // Set the generated ID on the user object
    } catch (error) {
        console.error('Error adding duty_appt to database:', error);
        throw error; // Re-throw the error for handling in the API route
    } finally {
        connection.release();
    }
    return duty_appt;
};
async function findDutyApptByName(name) {
    try {
        const [rows] = await pool.query('SELECT * FROM duty_appts WHERE name = ?', [name]);
        return rows[0] || null;
    } catch (error) {
        console.error('Error finding user by name:', error);
        // You can also throw a specific error here for handling in the route handler
    }
};
async function findDutyApptById(id) {
    try {
        const [rows] = await pool.query('SELECT * FROM duty_appts WHERE id = ?', [id]);
        return rows[0] || null;
    } catch (error) {
        console.error('Error finding duty_appt by id:', error);
        // You can also throw a specific error here for handling in the route handler
    }
};
async function getAllDutyAppts() {
    try {
        const [rows] = await pool.query('SELECT * FROM duty_appts');
        console.log("fetched duty_appts");
        return rows;
    } catch (error) {
        console.error('Error fetching all duty_appts:', error);
        // You can also throw a specific error here for handling in the route handler
    }
};
async function deleteDutyAppt(id) {
    try {
        const sql = `DELETE FROM duty_appts WHERE id = ?`;
        const result = await pool.execute(sql, [id]); // Delete duty_appt

        if (result[0].affectedRows === 0) {
            return false
        }
        return true;
    } catch (error) {
        console.error('Error deleting duty_appts:', error);
        // You can also throw a specific error here for handling in the route handler
    }
};
// Function to update a duty_appt in the MySQL database
async function updateDutyApptInDatabase(id, updatedDutyAppt) {
    const connection = await pool.getConnection();
    try {
        const sql = `UPDATE duty_appts SET name = ? WHERE id = ?`;
        const [results] = await connection.execute(sql, [updatedDutyAppt.name, id]);
        if (results.affectedRows === 0) {
            throw new Error('DutyAppt not found'); // Handle case where duty_appt wasn't updated (not found)
        }
    } catch (error) {
        console.error('Error updating duty_appt in database:', error);
        throw error; // Re-throw the error for handling in the API route
    } finally {
        connection.release();
    }
};
module.exports = { addDutyApptToDatabase, findDutyApptByName, findDutyApptById, updateDutyApptInDatabase, getAllDutyAppts, deleteDutyAppt }