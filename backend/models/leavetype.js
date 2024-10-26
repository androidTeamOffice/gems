const pool = require('../db/db'); // Assuming the file is named db.js

// Function to add a leavetype to the MySQL database
async function addLeavetypeToDatabase(leavetype) {
    const connection = await pool.getConnection();
    try {
        const sql = `INSERT INTO leavetypes (name) VALUES (?)`;
        const [results] = await connection.execute(sql, [leavetype.name]);
        leavetype.id = results.insertId; // Set the generated ID on the user object
    } catch (error) {
        console.error('Error adding leavetype to database:', error);
        throw error; // Re-throw the error for handling in the API route
    } finally {
        connection.release();
    }
    return leavetype;
};
async function findLeavetypeByName(name) {
    try {
        const [rows] = await pool.query('SELECT * FROM leavetypes WHERE name = ?', [name]);
        return rows[0] || null;
    } catch (error) {
        console.error('Error finding user by name:', error);
        // You can also throw a specific error here for handling in the route handler
    }
};
async function findLeavetypeById(id) {
    try {
        const [rows] = await pool.query('SELECT * FROM leavetypes WHERE id = ?', [id]);
        return rows[0] || null;
    } catch (error) {
        console.error('Error finding leavetype by id:', error);
        // You can also throw a specific error here for handling in the route handler
    }
};
async function getAllLeavetypes() {
    try {
        const [rows] = await pool.query('SELECT * FROM leavetypes');
        console.log("fetched leavetypes");
        return rows;
    } catch (error) {
        console.error('Error fetching all leavetypes:', error);
        // You can also throw a specific error here for handling in the route handler
    }
};
async function deleteLeavetype(id) {
    try {
        const sql = `DELETE FROM leavetypes WHERE id = ?`;
        const result = await pool.execute(sql, [id]); // Delete leavetype

        if (result[0].affectedRows === 0) {
            return false
        }
        return true;
    } catch (error) {
        console.error('Error deleting leavetypes:', error);
        // You can also throw a specific error here for handling in the route handler
    }
};
// Function to update a leavetype in the MySQL database
async function updateLeavetypeInDatabase(id, updatedLeavetype) {
    const connection = await pool.getConnection();
    try {
        const sql = `UPDATE leavetypes SET name = ? WHERE id = ?`;
        const [results] = await connection.execute(sql, [updatedLeavetype.name, id]);
        if (results.affectedRows === 0) {
            throw new Error('Leavetype not found'); // Handle case where leavetype wasn't updated (not found)
        }
    } catch (error) {
        console.error('Error updating leavetype in database:', error);
        throw error; // Re-throw the error for handling in the API route
    } finally {
        connection.release();
    }
};
module.exports = { addLeavetypeToDatabase, findLeavetypeByName, findLeavetypeById, updateLeavetypeInDatabase, getAllLeavetypes, deleteLeavetype }