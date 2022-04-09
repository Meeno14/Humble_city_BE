const db = require("../models");
const User = db.user;
checkDuplicateUsernameOrEmail = (req, res, next) => {
  // Username

  if (req.body.password.length < 8) {
    res.send({
      message: "Password have to be atleast 8 character long!",
      failed: true
    });
    return;
  }
  User.findOne({
    where: {
      username: req.body.username
    }
  }).then(user => {
    if (user) {
      res.send({
        message: "Failed! Username is already in use!",
        failed: true
      });
      return;
    }
    // Email
    User.findOne({
      where: {
        email: req.body.email
      }
    }).then(user => {
      if (user) {
        res.send({
          message: "Failed! Email is already in use!",
          failed: true
        });
        return;
      }
      next();
    });
  });
};
module.exports = checkDuplicateUsernameOrEmail;