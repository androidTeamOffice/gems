const pool = require('../db/db'); // Assuming the file is named db.js

// Function to add a civData to the MySQL database
async function addCivDataToDatabase(civData) {
    const connection = await pool.getConnection();
    try {
        const sql = `INSERT INTO civdatas (name) VALUES (?)`;
        const [results] = await connection.execute(sql, [civData.name]);
        civData.id = results.insertId; // Set the generated ID on the user object
    } catch (error) {
        console.error('Error adding civData to database:', error);
        throw error; // Re-throw the error for handling in the API route
    } finally {
        connection.release();
    }
    return civData;
};
async function findCivDataByName(name) {
    try {
        const [rows] = await pool.query('SELECT * FROM civdatas WHERE name = ?', [name]);
        return rows[0] || null;
    } catch (error) {
        console.error('Error finding user by name:', error);
        // You can also throw a specific error here for handling in the route handler
    }
};
async function findCivDataById(id) {
    try {
        const [rows] = await pool.query('SELECT * FROM civdatas WHERE id = ?', [id]);
        return rows[0] || null;
    } catch (error) {
        console.error('Error finding civData by id:', error);
        // You can also throw a specific error here for handling in the route handler
    }
};
async function getAllCivDatas() {
    try {
        const [rows] = await pool.query("SELECT * FROM civdatas where status = 'New'");
        console.log("fetched civDatas");
        return rows;
    } catch (error) {
        console.error('Error fetching all civDatas:', error);
        // You can also throw a specific error here for handling in the route handler
    }
};
async function getAllVerifiedCivDatas() {
    try {
        const [rows] = await pool.query("SELECT * FROM civdatas where status <> 'New'");
        console.log("fetched civDatas");
        return rows;
    } catch (error) {
        console.error('Error fetching all civDatas:', error);
        // You can also throw a specific error here for handling in the route handler
    }
};
async function deleteCivData(id) {
    try {
        const sql = `DELETE FROM civdatas WHERE id = ?`;
        const result = await pool.execute(sql, [id]); // Delete civData

        if (result[0].affectedRows === 0) {
            return false
        }
        return true;
    } catch (error) {
        console.error('Error deleting civDatas:', error);
        // You can also throw a specific error here for handling in the route handler
    }
};
async function rejectCivData(id,remarks) {
    try {
        const sql = `update civdatas set status='Rejected' , remarks=? WHERE id = ?`;
        const result = await pool.execute(sql, [remarks,id]); // Delete civData

        if (result[0].affectedRows === 0) {
            return false
        }
        return true;
    } catch (error) {
        console.error('Error deleting civDatas:', error);
        // You can also throw a specific error here for handling in the route handler
    }
};
async function verifyCivData(id) {
    try {
        const sql = `update civdatas set status='Verified', remarks='' WHERE id = ?`;
        const result = await pool.execute(sql, [id]); // Delete civData

        if (result[0].affectedRows === 0) {
            return false
        }
        return true;
    } catch (error) {
        console.error('Error verifyCivData civDatas:', error);
        // You can also throw a specific error here for handling in the route handler
    }
};
// Function to update a civData in the MySQL database
async function updateCivDataInDatabase(id, updatedCivData) {
    const connection = await pool.getConnection();
    try {
        const sql = `UPDATE civdatas SET name = ? WHERE id = ?`;
        const [results] = await connection.execute(sql, [updatedCivData.name, id]);
        if (results.affectedRows === 0) {
            throw new Error('CivData not found'); // Handle case where civData wasn't updated (not found)
        }
    } catch (error) {
        console.error('Error updating civData in database:', error);
        throw error; // Re-throw the error for handling in the API route
    } finally {
        connection.release();
    }
};
module.exports = { addCivDataToDatabase, findCivDataByName, findCivDataById, updateCivDataInDatabase, getAllCivDatas, getAllVerifiedCivDatas, deleteCivData, rejectCivData,verifyCivData }