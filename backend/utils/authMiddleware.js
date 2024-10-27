const jwt = require('jsonwebtoken');

const validateToken = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // Check for expired token
        if (decoded.exp < Date.now() / 1000) {
            // Redirect to login page on expired token
            return res.status(401).redirect('/authentication/sign-in/basic'); // Replace '/login' with your actual login route
        }
        req.user = decoded; // Attach decoded user information to the request object
        next(); // Allow the request to proceed
    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            // Handle invalid or expired token errors
            return res.status(401).json({ message: 'Invalid token' });
        }
        else if (error.name === 'TokenExpiredError') {
            // Handle invalid or expired token errors
            return res.status(401).json({ message: 'Expired token' });
        }
        console.log(error.name);
        // Handle other errors
        return res.status(500).json({ message: 'Internal server erroraa' });
    }
};
const checkManagerRole = (req, res, next) => {
    if (req.user.role !== 'manager') {
        return res.status(403).json({ message: 'Forbidden (Requires manager role)' });
    }
    next();
};

module.exports = { validateToken, checkManagerRole };