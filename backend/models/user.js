const pool = require('../db/db'); // Assuming the file is named db.js
const bcrypt = require('bcryptjs');

async function findUserByUsername(CNIC) {
    try {
        const [rows] = await pool.query('SELECT * FROM users WHERE user_cnic= ?', [CNIC]);
        return rows[0] || null;
    } catch (error) {
        console.error('Error finding user by username:', error);
        // You can also throw a specific error here for handling in the route handler
    }
};
async function findUserById(id) {
    try {
        const [rows] = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
        return rows[0] || null;
    } catch (error) {
        console.error('Error finding user by id:', error);
        // You can also throw a specific error here for handling in the route handler
    }
};

async function getAllUsers() {
    try {
        const [rows] = await pool.query('SELECT id, username, role FROM users');
        console.log("fetched");
        return rows;
    } catch (error) {
        console.error('Error fetching all users:', error);
        // You can also throw a specific error here for handling in the route handler
    }
};

async function resetPassword(req, res) {
    const { username } = req.body;

    // Check if user exists with the username
    const [rows] = await pool.query('SELECT * FROM users WHERE username = ?', [username]);
    if (!rows.length) {
        return res.status(400).json({ message: 'User not found' });
    }

    const user = rows[0];

    // Only allow reset if the requesting user is a manager (implement authorization logic)
    if (!user.role) { // Replace with your logic for checking manager role
        return res.status(403).json({ message: 'Unauthorized to reset password' });
    }

    // Update user password to default
    const hashedPassword = await bcrypt.hash('1234', 10); // Adjust cost factor as needed

    await pool.query('UPDATE users SET password_hash = ? WHERE id = ?', [hashedPassword, user.id]);

    res.json({ message: 'Password reset successfully' });
};
// Example function to add a user to the MySQL database
async function addUserToDatabase(user) {
    const connection = await pool.getConnection();
    try {
        const sql = `INSERT INTO users (username,user_cnic, password_hash, role) VALUES (?, ?, ?,?)`;
        const [results] = await connection.execute(sql, [user.name,user.CNIC, user.password, user.role]);
        user.id = results.insertId; // Set the generated ID on the user object
    } catch (error) {
        console.error('Error adding user to database:', error);
        throw error; // Re-throw the error for handling in the API route
    } finally {
        connection.release();
    }
    return user;
};
// Example function to update a user in the MySQL database
async function updateUserInDatabase(id, updatedUser) {
    const connection = await pool.getConnection();
    try {
        const sql = `UPDATE users SET username = ?, password_hash = ?, role = ? WHERE id = ?`;
        const [results] = await connection.execute(sql, [updatedUser.username, updatedUser.password, updatedUser.role, id]);
        if (results.affectedRows === 0) {
            throw new Error('User not found'); // Handle case where user wasn't updated (not found)
        }
    } catch (error) {
        console.error('Error updating user in database:', error);
        throw error; // Re-throw the error for handling in the API route
    } finally {
        connection.release();
    }
};
async function deleteUser(id) {
    try {
        const sql = `DELETE FROM users WHERE id = ?`;
        const result = await pool.execute(sql, [id]); // Delete duty

        if (result[0].affectedRows === 0) {
            return false
        }
        return true;
    } catch (error) {
        console.error('Error deleting user:', error);
        // You can also throw a specific error here for handling in the route handler
    }
};
module.exports = { getAllUsers, findUserByUsername, resetPassword, addUserToDatabase, updateUserInDatabase, findUserById, deleteUser };
