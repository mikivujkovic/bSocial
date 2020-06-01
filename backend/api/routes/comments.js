const express = require("express");

const router = express.Router();

const commentsCtrl = require("../controllers/comments");

router.post("/addComment", commentsCtrl.addComment);

module.exports = router;
