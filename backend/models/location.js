const pool = require('../db/db'); // Assuming the file is named db.js

// Function to add a location to the MySQL database
async function addLocationToDatabase(location) {
    const connection = await pool.getConnection();
    try {
        const sql = `INSERT INTO locations (name,description,capacity) VALUES (?,?,?)`;
        const [results] = await connection.execute(sql, [location.name, location.description, location.capacity]);
        location.id = results.insertId; // Set the generated ID on the user object
    } catch (error) {
        console.error('Error adding location to database:', error);
        throw error; // Re-throw the error for handling in the API route
    } finally {
        connection.release();
    }
    return location;
};
async function findLocationByName(name) {
    try {
        const [rows] = await pool.query('SELECT * FROM locations WHERE name = ?', [name]);
        return rows[0] || null;
    } catch (error) {
        console.error('Error finding location by name:', error);
        // You can also throw a specific error here for handling in the route handler
    }
};
async function findLocationById(id) {
    try {
        const [rows] = await pool.query('SELECT * FROM locations WHERE id = ?', [id]);
        return rows[0] || null;
    } catch (error) {
        console.error('Error finding location by id:', error);
        // You can also throw a specific error here for handling in the route handler
    }
};
async function getAllLocations() {
    try {
        const [rows] = await pool.query('SELECT * FROM locations');
        console.log("fetched locations");
        return rows;
    } catch (error) {
        console.error('Error fetching all locations:', error);
        // You can also throw a specific error here for handling in the route handler
    }
};
async function deleteLocation(id) {
    try {
        const sql = `DELETE FROM locations WHERE id = ?`;
        const result = await pool.execute(sql, [id]); // Delete location

        if (result[0].affectedRows === 0) {
            return false
        }
        return true;
    } catch (error) {
        console.error('Error deleting locations:', error);
        // You can also throw a specific error here for handling in the route handler
    }
};
// Function to update a location in the MySQL database
async function updateLocationInDatabase(id, updatedLocation) {
    const connection = await pool.getConnection();
    try {
        const sql = `UPDATE locations SET name = ?,description= ?,capacity= ? WHERE id = ?`;
        const [results] = await connection.execute(sql, [updatedLocation.name, updatedLocation.description, updatedLocation.capacity, id]);
        if (results.affectedRows === 0) {
            throw new Error('Location not found'); // Handle case where location wasn't updated (not found)
        }
    } catch (error) {
        console.error('Error updating location in database:', error);
        throw error; // Re-throw the error for handling in the API route
    } finally {
        connection.release();
    }
};
module.exports = { addLocationToDatabase, findLocationByName, findLocationById, updateLocationInDatabase, getAllLocations, deleteLocation }