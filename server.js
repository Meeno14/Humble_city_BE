const express = require("express");
const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server, {
  cors: { origin: "*" },
});
const cors = require("cors");
const db = require("./app/models");
const { authController, roomController } = require("./app/controllers");
const verifySignUp = require("./app/middleware/verifySignUp");
const bodyParser = require("body-parser");

io.on("connection", (socket) => {
  socket.emit("joining-room", socket.id);

  socket.on("join-room", (username, userId, roomId) => {
    socket.to(roomId).emit("new-user", username, userId);
    console.log(username, "joined");
    socket.join(roomId);
    socket.on("done-loading", () => {
      socket.to(roomId).emit("give-coords", userId);
    });

    socket.on("message", (message) => {
      socket.to(roomId).emit("send-message", { username, message });
    });

    socket.on("character-move", (direcrtion) => {
      io.in(roomId).emit("character-move", direcrtion, userId);
    });

    socket.on("get-coord", (x, y, toWho) => {
      io.to(toWho).emit("get-coord", x, y, userId);
    });

    socket.on("share-coord", (x, y) => {
      socket.to(roomId).emit("share-coord", x, y, userId);
    });

    socket.on("calling", (who, mic, webcam, calling) => {
      if (calling) return io.to(who).emit("called", userId, mic, webcam);
      io.to(who).emit("pass-device", userId, mic, webcam);
    });

    socket.on("leaving-call", (who, called) => {
      if (called) return io.to(who).emit("leaved-call", userId);
      io.to(who).emit("ask-to-leave", userId);
    });

    socket.on("toggle-input", (who, index, boolean) => {
      switch (index) {
        case 0:
          io.in(roomId).emit("toggle-mic", who, boolean);
          break;
        case 1:
          io.in(roomId).emit("toggle-cam", who, boolean);
          break;
        case 2:
          socket.emit("share-screen");
          break;
      }
    });

    socket.on("disconnect", () => {
      socket.to(roomId).emit("user-disconnected", userId);
      roomController.leaveRoom(userId, roomId);
    });
  });
});

app.use(cors());
app.use(bodyParser.json());

//routes
app.post("/api/register", verifySignUp, authController.signup);
app.post("/api/login", authController.signin);
app.post("/api/create-room", roomController.createRoom);
app.post("/api/connect-room", roomController.joinRoom);
app.post("/api/get-roomhistory", roomController.getRoomHistory);

db.sequelize.sync();

server.listen(3001, () => {
  console.log("listening on http://localhost:3001/");
});
