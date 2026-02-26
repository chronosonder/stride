const jwt = require('jsonwebtoken');

function generateToken(user) {
    return jwt.sign(
        { id: user.id, email: user.email, username: user.username },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
    );
};

function decodeToken(authToken) {
    return jwt.decode(authToken, process.env.JWT_SECRET);
}

module.exports = { generateToken, decodeToken };
