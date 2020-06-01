const express = require("express");
const bodyParser = require("body-parser");

const sequelize = require("./database/database");

const jsonParser = bodyParser.json();

const feedRoutes = require("./routes/feed");
const userRoutes = require("./routes/users");
const postRoutes = require("./routes/posts");
const commentRoutes = require("./routes/comments");
const followRoutes = require("./routes/follows");

const User = require("./models/user");
const Post = require("./models/posts");
const Comment = require("./models/comments");
const Follows = require("./models/follows");

const auth = require("./auth/auth");

const app = express();

// Routes
app.use("/", jsonParser, feedRoutes);
app.use("/auth", jsonParser, userRoutes);
app.use("/post", jsonParser, postRoutes);
app.use("/comment", jsonParser, commentRoutes);
app.use("/follows", jsonParser, followRoutes);

// Sequelize relationships setup
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

// Connect to database and start the app
sequelize
  .sync({ force: false, alter: true })
  .then((result) => {
    app.listen(3000);
    console.log(result);
  })
  .catch((err) => console.log(err));
