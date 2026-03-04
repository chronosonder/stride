const jwt = require('jsonwebtoken');

function generateToken(user) {
    return jwt.sign(
        { id: user.id, email: user.email, username: user.username },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
    );
};

function verifyToken(authToken) {
    return jwt.verify(authToken, process.env.JWT_SECRET);
}

module.exports = { generateToken, verifyToken };
