const { Op } = require('sequelize');
const db = require('../models/tables');
const { hasSockets } = require("../utils/socketnotifier");

const findFriendsConv = async (userId) => {
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

    const usersData = conversations.map(conv => {
        const friend = conv.firstUser.id !== userId ? conv.firstUser : conv.secondUser;
        delete friend.password;
        const isOnline = hasSockets(friend.id);
        return { ...friend, convId: conv.id, isOnline: isOnline };
    });

    return usersData;
}

module.exports = { findFriendsConv };