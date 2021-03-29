const express = require('express');
const router = require('express').Router();
const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');
const db = require('../models/tables');
const { checkCookieAuth, wrapErrors } = require('./utils/utils');

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
        let conversations = await db.Conversation.findAll({
            where: {
                [Op.or]: [
                    { firstUserId: userId },
                    { secondUserId: userId }
                ]
            },
            include: [
                { model: db.User, as: 'firstUser' },
                { model: db.User, as: 'secondUser' }
            ],
            raw: true,
            nest: true
        });
        conversations.forEach(con => {
            delete con.firstUser.password;
            delete con.secondUser.password;
        });
        res.status(200).json({ conversations });
    }));

const findConversation = (id1, id2) => {
    const firstUserId = Math.min(id1, id2);
    const secondUserId = Math.max(id1, id2);
    return db.Conversation.findOne({ where: { firstUserId, secondUserId } });
}

router.route('/message')
    .post(wrapErrors(async (req, res) => {
        const userFrom = checkCookieAuth(req);
        const conv = await findConversation(userFrom, req.body.receiverId);
        await db.Message.create({
            body: req.body.messageBody,
            seen: false,
            from: userFrom,
            to: req.body.receiverId,
            conversationId: conv.id
        });
        res.status(201).json({});
    }))
    .get(wrapErrors(async (req, res) => {
        const userFrom = checkCookieAuth(req);
        const conv = await findConversation(userFrom, req.query.to);
        const messages = await db.Message.findAll({ where: { conversationId: conv.id } });
        res.status(200).json({ messages });
    }));

module.exports = router;
