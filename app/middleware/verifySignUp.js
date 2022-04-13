const db = require("../models");
const User = db.user;
checkDuplicateUsernameOrEmail = (req, res, next) => {
  //Check Password
  if (req.body.password.length < 8) {
    res.send({
      failed: "Failed! Password have to be atleast 8 character long!",
    });
    return;
  }

  //Username
  if (req.body.username.length < 3) {
    res.send({
      failed: "Failed! Username have to be atleast 8 character long!",
    });
    return;
  }
  User.findOne({
    where: {
      username: req.body.username,
    },
  }).then((user) => {
    if (user) {
      res.send({
        failed: "Failed! Username is already in use!",
      });
      return;
    }
    // Email
    User.findOne({
      where: {
        email: req.body.email,
      },
    }).then((user) => {
      if (user) {
        res.send({
          failed: "Failed! Email is already in use!",
        });
        return;
      }
      next();
    });
  });
};
module.exports = checkDuplicateUsernameOrEmail;
