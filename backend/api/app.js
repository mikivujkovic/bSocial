const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const { Kafka } = require("kafkajs");

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

const auth = require("./middleware/auth");

const app = express();
app.use(cors());

// Routes
app.use("/feed", jsonParser, feedRoutes);
app.use("/auth", jsonParser, userRoutes);
app.use("/post", jsonParser, postRoutes);
app.use("/comment", jsonParser, commentRoutes);
app.use("/follows", jsonParser, followRoutes);

// Setup Kafka topics
async function setupKafka() {
  try {
    const kafka = new Kafka({
      clientId: "bSocial",
      brokers: ["localhost:9092"],
    });

    const admin = kafka.admin();
    await admin.connect();
    console.log("connected to kafka");

    await admin.createTopics({
      topics: [
        {
          topic: "Users",
        },
        {
          topic: "Comments",
        },
        {
          topic: "Posts",
        },
      ],
    });

    console.log("topics created");

    await admin.disconnect();
  } catch (err) {
    console.log("SOMETHING BAD HAPPENED TO KAFKA ", err);
  }
}

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
    setupKafka();
    app.listen(3000);
    // console.log(result);
  })
  .catch((err) => console.log(err));
