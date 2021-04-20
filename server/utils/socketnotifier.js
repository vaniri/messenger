let users2sockets = {};

const addSocket = (socket, userId) => { 
    if (users2sockets[userId]) {
        users2sockets[userId].push(socket);
    } else {
        users2sockets[userId] = [socket];
    }
};

const removeSocket = (socket, userId) => { 
    users2sockets[userId] = users2sockets[userId].filter(otherSocket => otherSocket !== socket); 
};

const notifyUser = (userId, channel, data) => {
    const sockets = users2sockets[userId];
    if (!sockets) {
        return;
    }

    sockets.forEach(socket => socket.emit(channel, data));
};

const hasSockets = (userId) => {
    if(users2sockets[userId]) { 
        return users2sockets[userId].length > 0;
    } else {
        return false
    }
};

module.exports = { addSocket, removeSocket, notifyUser, hasSockets };
