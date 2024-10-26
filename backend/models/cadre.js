const pool = require('../db/db'); // Assuming the file is named db.js

// Function to add a cadre to the MySQL database
async function addCadreToDatabase(cadre) {
    const connection = await pool.getConnection();
    try {
        const sql = `INSERT INTO cadres (name) VALUES (?)`;
        const [results] = await connection.execute(sql, [cadre.name]);
        cadre.id = results.insertId; // Set the generated ID on the user object
    } catch (error) {
        console.error('Error adding cadre to database:', error);
        throw error; // Re-throw the error for handling in the API route
    } finally {
        connection.release();
    }
    return cadre;
};
async function findCadreByName(name) {
    try {
        const [rows] = await pool.query('SELECT * FROM cadres WHERE name = ?', [name]);
        return rows[0] || null;
    } catch (error) {
        console.error('Error finding user by name:', error);
        // You can also throw a specific error here for handling in the route handler
    }
};
async function findCadreById(id) {
    try {
        const [rows] = await pool.query('SELECT * FROM cadres WHERE id = ?', [id]);
        return rows[0] || null;
    } catch (error) {
        console.error('Error finding cadre by id:', error);
        // You can also throw a specific error here for handling in the route handler
    }
};
async function getAllCadres() {
    try {
        const [rows] = await pool.query('SELECT * FROM cadres');
        console.log("fetched cadres");
        return rows;
    } catch (error) {
        console.error('Error fetching all cadres:', error);
        // You can also throw a specific error here for handling in the route handler
    }
};
async function deleteCadre(id) {
    try {
        const sql = `DELETE FROM cadres WHERE id = ?`;
        const result = await pool.execute(sql, [id]); // Delete cadre

        if (result[0].affectedRows === 0) {
            return false
        }
        return true;
    } catch (error) {
        console.error('Error deleting cadres:', error);
        // You can also throw a specific error here for handling in the route handler
    }
};
// Function to update a cadre in the MySQL database
async function updateCadreInDatabase(id, updatedCadre) {
    const connection = await pool.getConnection();
    try {
        const sql = `UPDATE cadres SET name = ? WHERE id = ?`;
        const [results] = await connection.execute(sql, [updatedCadre.name, id]);
        if (results.affectedRows === 0) {
            throw new Error('Cadre not found'); // Handle case where cadre wasn't updated (not found)
        }
    } catch (error) {
        console.error('Error updating cadre in database:', error);
        throw error; // Re-throw the error for handling in the API route
    } finally {
        connection.release();
    }
};
module.exports = { addCadreToDatabase, findCadreByName, findCadreById, updateCadreInDatabase, getAllCadres, deleteCadre }