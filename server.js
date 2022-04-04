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
    console.log(username, "joined")
    socket.join(roomId);

    socket.on("message", (message) => {
      console.log(message);
      socket.to(roomId).emit("send-message", `${username}: ${message}`);
    });

    socket.on("disconnect", () => {
      roomController.leaveRoom(userId, roomId)
      socket.emit("user-disconnected", userId, roomId);
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

// db.sequelize.sync({ force: true });

server.listen(3001, () => {
  console.log("listening on http://localhost:3001/");
});
