const express = require("express");

const router = express.Router();

const postCtrl = require("../controllers/posts");

router.post("/addPost", postCtrl.addPost);
router.get("/getUserIdforPostId", postCtrl.getUserIdforPostId);

module.exports = router;
