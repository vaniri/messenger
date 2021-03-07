const jwt = require('jsonwebtoken');

const jwtSecret = "this is my very important secret";

function generateToken(userId) {
    return jwt.sign({ userId }, jwtSecret);
}

module.exports = { jwtSecret, generateToken };