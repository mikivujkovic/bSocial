const express = require("express");

const sequelize = require("./database/database");

const feedRoutes = require("./routes/feed");

const User = require("./models/user");
const Post = require("./models/posts");
const Comment = require("./models/comments");
const Follows = require("./models/follows");

const app = express();

app.use(feedRoutes);

User.hasMany(Post, {
  foreignKey: "userId",
});
Post.belongsTo(User);
Post.hasMany(Comment, {
  foreignKey: "postId",
});
Comment.belongsTo(Post);
User.hasMany(Comment, {
  foreignKey: "userId",
});
Comment.belongsTo(User);
User.belongsToMany(User, {
  as: "Following",
  through: Follows,
  foreignKey: "followerId",
});

User.belongsToMany(User, {
  as: "Followed",
  through: Follows,
  foreignKey: "followingId",
});

sequelize
  .sync({ force: false, alter: true })
  .then((result) => {
    app.listen(3000);
    console.log(result);
  })
  .catch((err) => console.log(err));
