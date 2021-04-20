const express = require('express');
const router = require('express').Router();
const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');
const db = require('../models/tables');
const { checkCookieAuth, wrapErrors } = require('./utils/utils');
const { notifyUser, hasSockets } = require('../utils/socketnotifier');
const { findFriendsConv } = require('../models/utils');

router.use(express.json());
router.use(express.urlencoded({ extended: true }));

router.route("/")
    .put(wrapErrors(async (req, res) => {
        const userFrom = checkCookieAuth(req);
        const userTo = await db.User.findOne({ where: { username: req.body.username } });
        if (!userTo) {
            console.error(`${req.body.username} not found`);
            res.status(404).json({});
            return;
        }
        const firstUserId = Math.min(userFrom, userTo.id);
        const secondUserId = Math.max(userFrom, userTo.id);
        try {
            const conversation = await db.Conversation.create({ firstUserId, secondUserId });
            res.status(201).json({ conversation });
        } catch (err) {
            if (err === err instanceof UniqueConstraintError) {
                res.status(204).json({});
            } else {
                throw err;
            }
        }
    }))
    .get(wrapErrors(async (req, res) => {
        const userId = checkCookieAuth(req);
        const usersData = await findFriendsConv(userId);
        res.status(200).json({ usersData });
    }));

router.route('/:convId')
    .post(wrapErrors(async (req, res) => {
        const userFrom = checkCookieAuth(req);
        const message = await db.Message.create({
            body: req.body.messageBody,
            seen: false,
            from: userFrom,
            conversationId: req.params.convId
        });
        const convId = await db.Conversation.findOne({ where: { id: req.params.convId } });
        const receiverId = convId.firstUserId === userFrom ? convId.secondUserId : convId.firstUserId;
        notifyUser(receiverId, "IncomingMessage", message);
        res.status(201).json({});
    }))
    .get(wrapErrors(async (req, res) => {
        checkCookieAuth(req);
        const messages = await db.Message.findAll({ where: { conversationId: req.params.convId } });
        res.status(200).json({ messages });
    }));

module.exports = router;
