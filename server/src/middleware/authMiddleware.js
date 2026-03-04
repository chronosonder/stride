const jwt = require('jsonwebtoken');
const { UnauthorizedError, ForbiddenError } = require('../utils/customErrors');

// Check authentication token and attach user object payload
exports.authenticateToken = (req, res, next) => {
    // Get JWT
    const token = req.cookies.token;

    if (token == null) return next(new UnauthorizedError('Authorisation token missing!'));

    // Verify token
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return next(new ForbiddenError('Authentication invalid!'));
        
        // Attach user payload to request
        req.user = user;

        // Continue
        next();
    });
};