const express = require('express');
const router = require('express').Router();
const argon2 = require('argon2');
const { Op } = require('sequelize');
const db = require('../models/tables');
const { generateToken } = require('../utils/utils');
const { checkDuplicateErr, checkCookieAuth } = require('./utils/utils');

router.use(express.json());
router.use(express.urlencoded({ extended: true }));

router.post('/', async (req, res) => {
    try {
        req.body.password = await argon2.hash(req.body.password);
        const result = await db.User.create(req.body);
        const userId = result.id;
        res.cookie('token', generateToken(userId), { httpOnly: true });
        res.status(201).json({ result, userId });
    } catch (err) {
        checkDuplicateErr(err, res);
    }
});

router.post('/login', async (req, res) => {
    try {
        let userRecord = await db.User.findOne({ where: { email: req.body.email } });
        if (!userRecord) {
            throw new Error("User not found");
        }

        let correctPassword = await argon2.verify(userRecord.password, req.body.password);
        if (!correctPassword) {
            throw new Error("Invalid password");
        }

        console.log("Login Successful!");
        res.cookie('token', generateToken(userRecord.id), { httpOnly: true });
        res.status(200).json({
            userId: userRecord.id,
            username: userRecord.username,
            userImage: userRecord.image,
        });
    } catch (err) {
        console.error(`Error logging in: ${err}`);
        res.status(400).json({});
    }
});

router.post('/logout', async (req, res) => {
    try {
        res.cookie('token', null, { httpOnly: true });
        res.status(200).json({});
    } catch (err) {
        console.error(`Error logging out: ${err}`);
        res.status(400).json({});
    }
});

router.post('/refresh', async (req, res) => {
    let userId = null;

    try {
        userId = checkCookieAuth(req);
    } catch (err) {
        console.error(err);
        res.status(400).json({});
        return;
    }

    try {
        const { username, email, userImage } = await db.User.findOne({ where: { id: userId } });
        res.status(200).json({ userId, username, email, userImage });
    } catch (err) {
        console.error(err);
        res.status(500).json({});
    }
});

router.get("/search", async (req, res) => {
    try {
        checkCookieAuth(req);
    } catch (err) {
        console.error(err);
        res.status(400).json({});
        return;
    }

    try {
        const users = await db.User.findAll({ where: { username: { [Op.like]: `%${req.query.username}%` } } });
        res.status(200).json(users);
    } catch (err) {
        console.error(err);
        res.status(404).json({});
    }
});

router.get('/:id', async (req, res) => {
    try {
        let user = await db.User.findOne({ where: { _id: req.params.id } });
        delete user.password;
        req.json({ user });
    } catch (err) {
        console.error(err);
        res.status(500).json({});
    }
});

module.exports = router;