const express = require('express');
const { validateToken } = require('../utils/authMiddleware'); // Assuming the file is named resetPassword.js
const { resetPassword } = require('../models/user');

const router = express.Router();

// Assuming authMiddleware ensures manager access
router.post('/reset-password', validateToken, resetPassword); // Protect route using authMiddleware

module.exports = router;
