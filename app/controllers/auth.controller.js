const db = require("../models");
const User = db.user;
const bcrypt = require("bcryptjs");
exports.signup = (req, res) => {
  // Save User to Database
  payload = {
    username: req.body.username,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 8),
  };
  User.create(payload)
    .then((user) => {
      res.send({
        message: "User was registered successfully!",
        payload: {
          username: user.username,
          email: user.email,
          id: user.id,
          roomHistory: [],
        },
      });
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};
exports.signin = (req, res) => {
  User.findOne({
    where: {
      email: req.body.email,
    },
  }).then((user) => {
    if (user == null) {
      return res.send({ failed: "User Not found." });
    }

    var passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
    if (!passwordIsValid) {
      return res.send({
        failed: "Invalid Password!",
      });
    }

    user
      .getRooms()
      .then((rooms) => {
        let visitedRooms = [];

        for (let i = 0; i < rooms.length; i++) {
          visitedRooms.push({
            roomId: rooms[i].id,
            name: rooms[i].name,
            creator: rooms[i].creator,
          });
        }

        res.send({
          username: user.username,
          email: user.email,
          id: user.id,
          roomHistory: visitedRooms,
        });
      })
      .catch((err) => {
        res.send({ message: err.message });
      });
  });
};
