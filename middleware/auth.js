const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
    // Get token from headers
    const token = req.header('Authorization');

    // Check if token exists
    if (!token) {
        return res.status(401).json({ msg: 'No token, authorization denied' });
    }

    try {
        // Verify token
        const decoded = jwt.verify(token, process.env.SECRET);

        // Add user from payload to request object
        req.user = decoded.user;
        next();
    } catch (err) {
        res.status(401).json({ msg: 'Token is not valid' });
    }
};

module.exports = auth;
