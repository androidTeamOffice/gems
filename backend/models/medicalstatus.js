const pool = require('../db/db'); // Assuming the file is named db.js

// Function to add a medicalstatus to the MySQL database
async function addMedicalstatusToDatabase(medicalstatus) {
    const connection = await pool.getConnection();
    try {
        const sql = `INSERT INTO medicalstatuses (name) VALUES (?)`;
        const [results] = await connection.execute(sql, [medicalstatus.name]);
        medicalstatus.id = results.insertId; // Set the generated ID on the user object
    } catch (error) {
        console.error('Error adding medicalstatus to database:', error);
        throw error; // Re-throw the error for handling in the API route
    } finally {
        connection.release();
    }
    return medicalstatus;
};
async function findMedicalstatusByName(name) {
    try {
        const [rows] = await pool.query('SELECT * FROM medicalstatuses WHERE name = ?', [name]);
        return rows[0] || null;
    } catch (error) {
        console.error('Error finding user by name:', error);
        // You can also throw a specific error here for handling in the route handler
    }
};
async function findMedicalstatusById(id) {
    try {
        const [rows] = await pool.query('SELECT * FROM medicalstatuses WHERE id = ?', [id]);
        return rows[0] || null;
    } catch (error) {
        console.error('Error finding medicalstatus by id:', error);
        // You can also throw a specific error here for handling in the route handler
    }
};
async function getAllMedicalstatuses() {
    try {
        const [rows] = await pool.query('SELECT * FROM medicalstatuses');
        console.log("fetched medicalstatuses");
        return rows;
    } catch (error) {
        console.error('Error fetching all medicalstatuses:', error);
        // You can also throw a specific error here for handling in the route handler
    }
};
async function deleteMedicalstatus(id) {
    try {
        const sql = `DELETE FROM medicalstatuses WHERE id = ?`;
        const result = await pool.execute(sql, [id]); // Delete medicalstatus

        if (result[0].affectedRows === 0) {
            return false
        }
        return true;
    } catch (error) {
        console.error('Error deleting medicalstatuses:', error);
        // You can also throw a specific error here for handling in the route handler
    }
};
// Function to update a medicalstatus in the MySQL database
async function updateMedicalstatusInDatabase(id, updatedMedicalstatus) {
    const connection = await pool.getConnection();
    try {
        const sql = `UPDATE medicalstatuses SET name = ? WHERE id = ?`;
        const [results] = await connection.execute(sql, [updatedMedicalstatus.name, id]);
        if (results.affectedRows === 0) {
            throw new Error('Medicalstatus not found'); // Handle case where medicalstatus wasn't updated (not found)
        }
    } catch (error) {
        console.error('Error updating medicalstatus in database:', error);
        throw error; // Re-throw the error for handling in the API route
    } finally {
        connection.release();
    }
};
module.exports = { addMedicalstatusToDatabase, findMedicalstatusByName, findMedicalstatusById, updateMedicalstatusInDatabase, getAllMedicalstatuses, deleteMedicalstatus }