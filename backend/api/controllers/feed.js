const Follows = require("../models/follows");
const Post = require("../models/posts");
const User = require("../models/user");
const sequelize = require("sequelize");

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

exports.getPeopleNotFollow = (req, res) => {
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

      User.findAll({
        where: {
          id: {
            [sequelize.Op.not]: followingIds,
          },
        },
      })
        .then((users) => {
          res.json(users);
        })
        .catch((err) => console.log(err));
    })
    .catch((err) => console.log(err));
};
