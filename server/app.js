const createError = require("http-errors");
const express = require("express");
const { join } = require("path");
const cookieParser = require("cookie-parser");
const socketCookieParser = require("socket.io-cookie-parser");
const logger = require("morgan");
const path = require("path");
const { json, urlencoded } = require("express");
const { getErrorStatusCode, checkCookieAuth } = require("./routes/utils/utils");
const http = require("http");
const socketIo = require("socket.io");
const { addSocket, removeSocket, hasSockets, notifyUser } = require("./utils/socketnotifier");
const { findFriendsConv } = require('./models/utils');
const { User } = require("./models/tables");

const app = express();

app.use(logger("dev"));
app.use(json());
app.use(express.json({ limit: '50mb' }));
app.use(urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(join(__dirname, "public")));

app.use('/', require('./routes/index'));

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});


// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  console.error(err);
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(getErrorStatusCode(err));
  res.json({});
});

const server = http.createServer(app);

const io = socketIo(server);

io.use(socketCookieParser());
io.use((socket, next) => {
  try {
    socket.userId = checkCookieAuth(socket.request);
    next();
  } catch (err) {
    next(err);
  }
});

const notifyOnlineStatus = async (userId, isOnline) => {
  if (!hasSockets(userId)) {
    const convs = await findFriendsConv(userId);
    convs.forEach(conv => notifyUser(conv.id, "UserStatus", { convId: conv.convId, isOnline }));
  }
};

io.on("connection", async (socket) => {
  console.log(`client ${socket.userId} connected ${socket.id}`);
  notifyOnlineStatus(socket.userId, true);
  addSocket(socket, socket.userId);

  socket.on("disconnect", () => {
    console.log(`client ${socket.userId} disconnected`);
    removeSocket(socket, socket.userId);
    notifyOnlineStatus(socket.userId, false);
  });
});

module.exports = { app, server };
