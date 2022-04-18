module.exports = (sequelize, Sequelize, name) => {
  const Play = sequelize.define(name, {
    player: Sequelize.STRING,
    player_id: {
      type: Sequelize.STRING,
      primaryKey: true,
    },
  });
  return Play;
};
