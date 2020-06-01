const Follows = require("../models/follows");
const Post = require("../models/posts");

exports.getFeedForId = (req, res) => {
  const id = req.body.id;

  Follows.findAll({
    where: {
      followerId: id,
    },
  })
    .then((following) => {
      const followingIds = [];
      following.forEach((follow) => followingIds.push(follow.id));
      followingIds.push(id);
      console.log("following: ", followingIds);

      Post.findAll({
        where: {
          userId: followingIds,
        },
      })
        .then((posts) => {
          res.json(posts);
        })
        .catch((err) => console.log(err));
    })
    .catch((err) => console.log(err));
};
