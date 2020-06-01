const Sequelize = require("sequelize");

const sequelize = require("../database/database");

const Post = sequelize.define("post", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNul: false,
    primaryKey: true,
  },
  message: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  userId: Sequelize.INTEGER,
  username: Sequelize.STRING,
  email: Sequelize.STRING,
});

module.exports = Post;
