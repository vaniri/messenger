const { UniqueConstraintError } = require('sequelize');
const jwt = require('jsonwebtoken');
const { getSecret } = require('../../utils/utils');

const checkDuplicateErr = (err, res) => {
    if (err instanceof UniqueConstraintError) {
        res.status(409);
        res.send({ "message": "User already exists" });
    } else {
        res.status(500);
        res.send({});
    }
}

const checkCookieAuth = (req) => {
    const token = jwt.verify(req.cookies.token, getSecret());
    userId = token.userId;
    if (!userId) {
        throw new Error("Invalid token");
    }

    return userId;
}

module.exports = { checkDuplicateErr, checkCookieAuth };