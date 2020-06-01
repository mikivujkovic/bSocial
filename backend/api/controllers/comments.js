const Comment = require("../models/comments");
const { Kafka } = require("kafkajs");
const axios = require("axios");

exports.addComment = (req, res) => {
  const userId = req.body.userId;
  const username = req.body.username;
  const email = req.body.email;
  const postId = req.body.postId;
  const content = req.body.content;
  Comment.create({
    content: content,
    postId: postId,
    userId: userId,
    username: username,
    email: email,
  })
    .then(function (comment) {
      const timestamp = comment.createdAt;
      axios.post("http://localhost:3001/sendComment", {
        sender: username,
        email: email,
        senderId: userId,
        timestamp: timestamp,
        postId: postId,
        commentId: comment.id,
        content: content,
      });
      res.status(200).send(comment);
    })
    .catch((err) => {
      return res.send(err);
    });
};

exports.getAllComments = (req, res) => {
  Comment.findAll()
    .then((comments) => {
      res.send(comments);
    })
    .catch();
};
