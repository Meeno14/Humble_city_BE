module.exports = (sequelize, Sequelize, name) => {
  const Room = sequelize.define("rooms", {
    id: {
      type: Sequelize.STRING,
      primaryKey: true,
    },
    name: Sequelize.STRING,
    creator: Sequelize.STRING,
  });
  return Room;
};
