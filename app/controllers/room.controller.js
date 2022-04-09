const db = require("../models");
const User = db.user;
const Room = db.room;
const Sequelize = db.Sequelize;
const sequelize = db.sequelize;

exports.createRoom = (req, res) => {
  const { name, id } = req.body;

  if (name === "") {
    res.send({ failed: "please fill out the room name" });
    return;
  }

  const play = require("../models/play.model")(sequelize, Sequelize, id);

  //Add more room to the list
  Room.create({ name, room_id: id }).then(() => {
    //create new table containing players
    play.sync().then(() => {
      res.send({ message: "Successfully created a room!" });
    });
  });
};
exports.joinRoom = (req, res) => {
  const { room, roomId, user, playerId } = req.body;

  //insert user to userlist on the romm
  Room.findOne({
    where: {
      room_id: roomId,
      name: room,
    },
  }).then((result) => {
    //Check is room with inputted name exist
    if (result == null)
      return res.send({ failed: `Room ${room} doesn't exist` });

    const play = require("../models/play.model")(sequelize, Sequelize, roomId);

    //insert new player to joined room
    play
      .create({
        player: user.name,
        player_id: playerId,
      })
      .then(() => {
        play.findAll().then((results) => {
          res.send({ results });
        });
      });

    //update user room history
    if (user.id) {
      User.findOne({
        where: {
          id: user.id,
        },
      }).then((user) => {
        Room.findOne({
          where: {
            room_id: roomId,
          },
        }).then((room) => {
          user.addRooms(room);
        });
      });
    }
  });
};

exports.leaveRoom = (userId, roomId) => {
  const play = require("../models/play.model")(sequelize, Sequelize, roomId);

  Room.findOne({
    where: {
      room_id: roomId,
    },
  }).then((result) => {
    if (result == null) return;

    play.destroy({
      where: {
        player_id: userId,
      },
    });
  });
};
