module.exports = (sequelize, Sequelize, name) => {
  const Room = sequelize.define("rooms", {
    name: Sequelize.STRING,
    room_id: Sequelize.STRING,
    creator: Sequelize.STRING,
  });
  return Room;
};
