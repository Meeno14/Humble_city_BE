module.exports = (sequelize, Sequelize, name) => {
  const Room = sequelize.define("rooms", {
    name: Sequelize.STRING,
    room_id: {
      type: Sequelize.STRING,
      primaryKey: true,
    },
    creator: Sequelize.STRING,
  });
  return Room;
};
