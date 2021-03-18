const jwt = require('jsonwebtoken');

const generateToken = (userId) => {
    return jwt.sign({ userId }, process.env.JWT_SECRET);
}

const getSecret = () => {
    return process.env.JWT_SECRET;
}

module.exports = { generateToken, getSecret };