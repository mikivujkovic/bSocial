const Comment = require("../models/comments");

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
    .then(res.status(200).send("Comment created"))
    .catch((err) => {
      return res.send(err);
    });
};
