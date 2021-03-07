const express = require('express');
const router = require('express').Router();
const argon2 = require('argon2');
const db = require('../models/tables');
const { generateToken } = require('../utils/utils');
const { checkDuplicateErr } = require('./utils/utils');

router.use(express.json());
router.use(express.urlencoded({ extended: true }));

router.post('/', async (req, res) => {
    try {
        req.body.password = await argon2.hash(req.body.password);
        let result = await db.User.create(req.body);
        let userId = result.id;
        res.status(201).json({ result, userId, token: generateToken(userId) });
    } catch (err) {
        checkDuplicateErr(err, res);
    }
});

router.route('/:id')
    .get(async (req, res) => {
        try {
            // TODO test this
            let user = await db.User.findOne({ where: { _id: req.params.id } });
            delete user.password;
            req.json({ user });
        } catch (err) {
            console.error(err);
            res.status(500).send({});
        }
    });

router.post('/login', async (req, res) => {
    try {
        console.log(req.body);
        let userRecord = await db.User.findOne({ where: { email: req.body.email } });
        console.log(userRecord);
        if (!userRecord) {
            res.status(404).send({ "message": "User not found" });
            return;
        }

        let correctPassword = await argon2.verify(userRecord.password, req.body.password);
        if (!correctPassword) {
            res.status(401).send({ "message": "Invalid password" });
            return;
        }

        console.log("Login Successful!");
        res.status(200).json({
            userId: userRecord.id,
            username: userRecord.username,
            userImage: userRecord.image,
            token: generateToken(userRecord.id)
        });
    } catch (err) {
        console.error(`Error logging in: ${err}`);
        res.status(401).send({});
    }
});

module.exports = router;