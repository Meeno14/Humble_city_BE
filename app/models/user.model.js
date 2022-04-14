module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define("user", {
    username: Sequelize.STRING,
    email: Sequelize.STRING,
    password: Sequelize.TEXT,
  });
  return User;
};
