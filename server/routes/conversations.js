const express = require('express');
const router = require('express').Router();
const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');
const db = require('../models/tables');
const { checkCookieAuth } = require('./utils/utils');

router.use(express.json());
router.use(express.urlencoded({ extended: true }));

router.route("/")
    .put(async (req, res) => {
        let userFrom = null;

        try {
            userFrom = checkCookieAuth(req);
        } catch (err) {
            console.error(err);
            res.status(400).json({});
            return;
        }

        try {
            const userTo = await db.User.findOne({ where: { username: req.body.username } });
            if (!userTo) {
                console.error(`${req.body.username} not found`);
                res.status(404).json({});
                return;
            }
            const firstUserId = Math.min(userFrom, userTo.id);
            const secondUserId = Math.max(userFrom, userTo.id);
            const conversation = await db.Conversation.create({ firstUserId, secondUserId });
            res.status(200).json({ conversation });
        } catch (err) {
            console.error(err);
            res.status(500).json({});
        }
    })

    .get(async (req, res) => {
        let userId = null;
        try {
            userId = checkCookieAuth(req);
        } catch (err) {
            console.error(err);
            res.status(400).json({});
            return;
        }

        try {
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
        } catch (err) {
            console.log(err);
            res.status(500).json({});
        }
    });

const findConversation = (id1, id2) => {
    const firstUserId = Math.min(id1, id2);
    const secondUserId = Math.max(id1, id2);
    return db.Conversation.findOne({ where: { firstUserId, secondUserId } });

};

router.route('/message')
    .post(async (req, res) => {
        let userFrom = null;
        try {
            userFrom = checkCookieAuth(req);
        } catch (err) {
            console.error(err);
            res.status(400).json({});
            return;
        }

        try {
            const conv = await findConversation(userFrom, req.body.receiverId);
            await db.Message.create({
                body: req.body.messageBody,
                seen: false,
                from: userFrom,
                to: req.body.receiverId,
                conversationId: conv.id
            });
            res.status(201).json({});
        } catch (err) {
            console.error(err);
            res.status(400).json({});
        }
    })
    .get(async (req, res) => {
        let userFrom = null;
        try {
            userFrom = checkCookieAuth(req);
        } catch (err) {
            console.error(err);
            res.status(400).json({});
            return;
        }
        try {
            const conv = await findConversation(userFrom, req.query.to);
            const messages = await db.Message.findAll({ where: { conversationId: conv.id } });
            res.status(200).json({ messages });
        } catch (err) {
            console.error(err);
            res.status(500).json({});
        }
    });

module.exports = router;