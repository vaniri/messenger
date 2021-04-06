let users2sockets = {};

const addSocket = (socket, userId) => { users2sockets[userId] = socket; };
const removeSocket = (userId) => { delete users2sockets[userId]; }

const notifyUser = (userId, data) => {
    const socket = users2sockets[userId];
    if (!socket) {
        return;
    }

    socket.emit("IncomingMessage", data);
};

module.exports = { addSocket, removeSocket, notifyUser };
