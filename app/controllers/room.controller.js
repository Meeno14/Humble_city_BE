const db = require("../models");
const User = db.user;
const Room = db.room;
const Sequelize = db.Sequelize;
const sequelize = db.sequelize;

exports.createRoom = (req, res) => {
  const { name, id } = req.body;

  if (name === "") {
    res.send({ failed: "please fill out the room name" });
  }

  const Play = require("../models/play.model")(sequelize, Sequelize, id);

  //Add more room to the list
  Room.create({ name, room_id: id }).then(() => {
    //create new table containing players
    Play.sync().then(() => {
      res.send({ message: "Successfully created a room!" });
    });
  });
};
exports.joinRoom = (req, res) => {
  const { room, roomId , username, id } = req.body

  Room.findOne({
    where: {
      room_id: roomId,
      name: room,
    },
  }).then((result) => {

    //Check is room with inputted name exist
    if (result == null) return res.send({ failed: `Room ${room} doesn't exist`})


    const Play = require("../models/play.model")(
      sequelize,
      Sequelize,
      result.room_id
    );

    //insert new player to joined room
    Play.create({
      player: username,
      player_id: id,
    }).then(() => {
      Play.findAll().then((results) => {
        res.send({results, roomId: result.room_id});
      });
    });
  });
};

exports.leaveRoom = (userId, roomId) => {
  const Play = require("../models/play.model")(
    sequelize,
    Sequelize,
    roomId
  );

  Play.destroy({
    where: {
      player_id: userId,
    },
  })
};
