const Sequelize = require("sequelize");

const sequelize = require("../database/database");

const Comment = sequelize.define("comment", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNul: false,
    primaryKey: true,
  },
  content: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  postId: Sequelize.INTEGER,
  userId: Sequelize.INTEGER,
  username: Sequelize.STRING,
  email: Sequelize.STRING,
});

module.exports = Comment;
