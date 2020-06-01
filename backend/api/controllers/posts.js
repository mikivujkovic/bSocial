const Post = require("../models/posts");

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
    .then(res.status(200).send("Post created"))
    .catch((err) => {
      return res.send(err);
    });
};
