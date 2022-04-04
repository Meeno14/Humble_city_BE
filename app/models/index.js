const config = require("../config/db.config.js");
const Sequelize = require("sequelize");
const sequelize = new Sequelize(
  config.DB,
  config.USER,
  config.PASSWORD,
  {
    host: config.HOST,
    dialect: config.dialect,
    pool: {
      max: config.pool.max,
      min: config.pool.min,
      acquire: config.pool.acquire,
      idle: config.pool.idle
    }
  }
);
const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;
db.user = require("./user.model.js")(sequelize, Sequelize);
db.room = require("./room.model.js")(sequelize, Sequelize);
db.room.belongsToMany(db.user, {
  through: "user_rooms",
  foreignKey: "roomId",
  otherKey: "userId"
});
db.user.belongsToMany(db.room, {
  through: "user_rooms",
  foreignKey: "userId",
  otherKey: "roomId"
});
module.exports = db;