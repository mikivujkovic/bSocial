const Post = require("../models/posts");
const { Kafka } = require("kafkajs");

exports.addPost = (req, res) => {
  const userId = req.body.userId;
  const username = req.body.username;
  const email = req.body.email;
  const message = req.body.message;
  Post.create({
    message: message,
    userId: userId,
    username: username,
    email: email,
  })
    .then(async function (post) {
      const timestamp = post.createdAt;
      axios.post("http://localhost:3001/sendPost", {
        username: username,
        email: email,
        userId: userId,
        timestamp: timestamp,
        postId: post.id,
        content: message,
      });
      res.status(200).send(post);
    })
    .catch((err) => {
      return res.send(err);
    });
};

exports.getUserIdforPostId = (req, res) => {
  const postId = req.body.postId;
  console.log("postId: ", postId);
  Post.findAll({
    where: {
      postId: postId,
    },
  })
    .then(function (posts) {
      const post = posts[0];

      if (post) {
        const user = post.userId;
        res.json({
          userId: user,
        });
      } else {
        res.json({
          userId: -1,
        });
      }
    })
    .catch((err) => console.log(err));
};
