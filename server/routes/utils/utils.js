const { UniqueConstraintError } = require('sequelize');

function checkDuplicateErr(err, res) {
    if (err instanceof UniqueConstraintError) {
        res.status(409);
        res.send({ "message": "User already exists" });
    } else {
        res.status(500);
        res.send({});
    }
}

module.exports = { checkDuplicateErr };