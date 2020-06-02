const express = require("express");

const router = express.Router();

const feedCtrl = require("../controllers/feed");

router.get("/", (req, res) => {
  res.send("Home Page");
});

router.post("/test", (req, res) => {
  const test1 = req.body.test1;
  const test2 = req.body.test2;
  res.send({
    test1,
    test2,
  });
});

router.post("/feedForId", feedCtrl.getFeedForId);
router.post("/noFollow", feedCtrl.getPeopleNotFollow);

module.exports = router;
