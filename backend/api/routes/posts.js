const express = require("express");

const router = express.Router();

const postCtrl = require("../controllers/posts");

router.post("/addPost", postCtrl.addPost);

module.exports = router;
