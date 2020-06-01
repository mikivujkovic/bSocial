const Follows = require("../models/follows");

exports.addFollow = (req, res) => {
  const followerId = req.body.followerId;
  const followingId = req.body.followingId;
  Follows.create({
    followerId: followerId,
    followingId: followingId,
  })
    .then(res.status(200).send("Follows created"))
    .catch((err) => {
      return res.send(err);
    });
};
