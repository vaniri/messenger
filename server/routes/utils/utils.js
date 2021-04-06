const { UniqueConstraintError } = require('sequelize');
const jwt = require('jsonwebtoken');
const { getSecret } = require('../../utils/utils');

class AuthenticationError extends Error { };

const checkCookieAuth = (req) => {
    const token = jwt.verify(req.cookies.token, getSecret());
    const userId = token.userId;
    if (!userId) {
        throw new AuthenticationError("Invalid token");
    }
    return userId;
}

const wrapErrors = (func) => {
    return async (req, res, next) => {
        try {
            await func(req, res);
        } catch (err) {
            next(err);
        }
    }
}

const getErrorStatusCode = (err) => {
    if (err instanceof UniqueConstraintError) {
        return 409;
    } else if (err instanceof AuthenticationError) {
        return 401;
    } else {
        return 500;
    }
}

module.exports = { checkCookieAuth, wrapErrors, AuthenticationError, getErrorStatusCode };
