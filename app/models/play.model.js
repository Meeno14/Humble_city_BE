module.exports = (sequelize, Sequelize, name) => {
  const Play = sequelize.define(name, {
    id: {
      type: Sequelize.STRING,
      primaryKey: true,
    },
    player: Sequelize.STRING,
  });
  return Play;
};
