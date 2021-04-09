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
}

const notifyUser = (userId, data) => {
    const sockets = users2sockets[userId];
    if (!sockets) {
        return;
    }

    sockets.forEach(socket => socket.emit("IncomingMessage", data));
};

module.exports = { addSocket, removeSocket, notifyUser };
