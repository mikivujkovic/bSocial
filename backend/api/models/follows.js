const Sequelize = require("sequelize");

const sequelize = require("../database/database");

const Follows = sequelize.define("follows", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNul: false,
    primaryKey: true,
  },
  followerId: Sequelize.INTEGER,
  followingId: Sequelize.INTEGER,
});

module.exports = Follows;
