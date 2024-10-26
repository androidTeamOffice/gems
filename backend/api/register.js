const pool = require('../db/db');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const express = require('express');
const jwt = require('jsonwebtoken'); // Replace with your JWT library if needed

async function registerUser(username, password, role) {
    const hashedPassword = await bcrypt.hash(password, 10); // Adjust cost factor as needed

    const [rows] = await pool.query('INSERT INTO users (username, password_hash, role) VALUES (?, ?, ?)', [username, hashedPassword, role]);

    if (rows.affectedRows === 0) {
        throw new Error('Failed to register user');
    }

    const newUser = { id: rows.insertId, username, role }; // Replace with relevant user information
    return newUser;
}

const router = express.Router();

router.post('/register', async (req, res) => {
    console.log(req.body);
    const { username = '', password = '', role = 'user' } = req.body;

    // Input validation (optional)
    if (!username || !password) {
        return res.status(400).json({ message: 'Missing username or password' });
    }

    try {
        const newUser = await registerUser(username, password, role);

        // Generate JWT token (can be used for immediate login after registration)
        const payload = { userId: newUser.id, role: newUser.role };
        const secret = process.env.JWT_SECRET;
        const token = jwt.sign(payload, secret, { expiresIn: '30m' }); // Set appropriate expiration time

        res.json({ message: 'Registration successful', user: newUser, token }); // Include token if generated
    } catch (error) {
        console.error(error);
        if (error.message.includes('Duplicate entry')) {
            return res.status(409).json({ message: 'Username already exists' });
        }
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;

