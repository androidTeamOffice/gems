const pool = require('../db/db'); // Assuming the file is named db.js

// Function to add a rank to the MySQL database
async function addRankToDatabase(rank) {
    const connection = await pool.getConnection();
    try {
        const sql = `INSERT INTO ranks (name) VALUES (?)`;
        const [results] = await connection.execute(sql, [rank.name]);
        rank.id = results.insertId; // Set the generated ID on the user object
    } catch (error) {
        console.error('Error adding rank to database:', error);
        throw error; // Re-throw the error for handling in the API route
    } finally {
        connection.release();
    }
    return rank;
};
async function findRankByName(name) {
    try {
        const [rows] = await pool.query('SELECT * FROM ranks WHERE name = ?', [name]);
        return rows[0] || null;
    } catch (error) {
        console.error('Error finding user by name:', error);
        // You can also throw a specific error here for handling in the route handler
    }
};
async function findRankById(id) {
    try {
        const [rows] = await pool.query('SELECT * FROM ranks WHERE id = ?', [id]);
        return rows[0] || null;
    } catch (error) {
        console.error('Error finding rank by id:', error);
        // You can also throw a specific error here for handling in the route handler
    }
};
async function getAllRanks() {
    try {
        const [rows] = await pool.query('SELECT * FROM ranks');
        console.log("fetched ranks");
        return rows;
    } catch (error) {
        console.error('Error fetching all ranks:', error);
        // You can also throw a specific error here for handling in the route handler
    }
};
async function deleteRank(id) {
    try {
        const sql = `DELETE FROM ranks WHERE id = ?`;
        const result = await pool.execute(sql, [id]); // Delete rank

        if (result[0].affectedRows === 0) {
            return false
        }
        return true;
    } catch (error) {
        console.error('Error deleting ranks:', error);
        // You can also throw a specific error here for handling in the route handler
    }
};
// Function to update a rank in the MySQL database
async function updateRankInDatabase(id, updatedRank) {
    const connection = await pool.getConnection();
    try {
        const sql = `UPDATE ranks SET name = ? WHERE id = ?`;
        const [results] = await connection.execute(sql, [updatedRank.name, id]);
        if (results.affectedRows === 0) {
            throw new Error('Rank not found'); // Handle case where rank wasn't updated (not found)
        }
    } catch (error) {
        console.error('Error updating rank in database:', error);
        throw error; // Re-throw the error for handling in the API route
    } finally {
        connection.release();
    }
};
module.exports = { addRankToDatabase, findRankByName, findRankById, updateRankInDatabase, getAllRanks, deleteRank }