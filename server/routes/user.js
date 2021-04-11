const express = require('express');
const router = require('express').Router();
const argon2 = require('argon2');
const { Op } = require('sequelize');
const db = require('../models/tables');
const { generateToken } = require('../utils/utils');
const { AuthenticationError, checkCookieAuth, wrapErrors } = require('./utils/utils');

router.use(express.json());
router.use(express.urlencoded({ extended: true }));

router.post('/', wrapErrors(async (req, res) => {
    req.body.password = await argon2.hash(req.body.password);
    const result = await db.User.create(req.body);
    const userId = result.id;
    res.cookie('token', generateToken(userId), { httpOnly: true });
    res.status(201).json({ result, userId });
}));

router.post('/login', wrapErrors(async (req, res) => {
    const userRecord = await db.User.findOne({ where: { email: req.body.email } });
    if (!userRecord) {
        throw new AuthenticationError("User not found");
    }

    const correctPassword = await argon2.verify(userRecord.password, req.body.password);
    if (!correctPassword) {
        throw new AuthenticationError("Invalid password");
    }

    res.cookie('token', generateToken(userRecord.id), { httpOnly: true });
    res.status(200).json({
        userId: userRecord.id,
        username: userRecord.username,
        userImage: userRecord.image,
    });
}));

router.post('/logout', wrapErrors(async (req, res) => {
    res.cookie('token', null, { httpOnly: true });
    res.status(200).json({});
}));

router.post('/refresh', wrapErrors(async (req, res) => {
    const userId = checkCookieAuth(req);
    const { username, email, userImage } = await db.User.findOne({ where: { id: userId } });
    res.status(200).json({ userId, username, email, userImage });
}));

router.get("/search", wrapErrors(async (req, res) => {
    checkCookieAuth(req);
    const users = await db.User.findAll({ where: { username: { [Op.like]: `%${req.query.username}%` } } });
    res.status(200).json(users);
}));

router.get('/byId/:id', wrapErrors(async (req, res) => {
    let user = await db.User.findOne({ where: { id: req.params.id } });
    delete user.password;
    res.json({ user });
}));

module.exports = router;