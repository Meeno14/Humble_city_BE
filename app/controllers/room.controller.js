const { user } = require("../models");
const db = require("../models");
const User = db.user;
const Room = db.room;
const Sequelize = db.Sequelize;
const sequelize = db.sequelize;
const async = require("async");

exports.createRoom = (req, res) => {
  const { name, id, user } = req.body;

  if (name === "") {
    res.send({ failed: "please fill out the room name" });
    return;
  }

  const Play = require("../models/play.model")(sequelize, Sequelize, id);

  //Add more room to the list
  Room.create({ name, id, creator: user }).then(() => {
    //create new table containing players
    Play.sync().then(() => {
      res.send({ message: "Successfully created a room!" });
    });
  });
};
exports.joinRoom = (req, res) => {
  const { room, roomId, user, playerId } = req.body;

  //insert user to userlist on the romm
  Room.findOne({
    where: {
      id: roomId,
      name: room,
    },
  }).then((result) => {
    //Check is room with inputted name exist
    if (result == null)
      return res.send({ failed: `Room ${room} doesn't exist` });

    const Play = require("../models/play.model")(sequelize, Sequelize, roomId);

    //insert new player to joined room
    Play.create({
      player: user.name,
      id: playerId,
    }).then(() => {
      Play.findAll({ order: [["player", "ASC"]] }).then((results) => {
        res.send({ results, creator: result.creator });
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
            id: roomId,
          },
        }).then((room) => {
          user.addRooms(room);
        });
      });
    }
  });
};

exports.leaveRoom = (userId, roomId) => {
  const Play = require("../models/play.model")(sequelize, Sequelize, roomId);

  Room.findOne({
    where: {
      id: roomId,
    },
  }).then((result) => {
    if (result == null) return;

    Play.destroy({
      where: {
        id: userId,
      },
    });
  });
};

exports.getRoomHistory = (req, res) => {
  const { userId } = req.body;
  User.findOne({
    where: {
      id: userId,
    },
  }).then((user) => {
    user.getRooms().then(async function (rooms) {
      let visitedRooms = [];

      for (let i = 0; i < rooms.length; i++) {
        const Play = require("../models/play.model")(
          sequelize,
          Sequelize,
          rooms[i].id
        );

        async;
        const onlineUser = await Play.findAll();
        // console.log(userOnRooms);
        visitedRooms.push({
          roomId: rooms[i].id,
          name: rooms[i].name,
          onlineUser: onlineUser.length,
          creator: rooms[i].creator,
        });
      }
      res.send(visitedRooms);
    });
  });
};
