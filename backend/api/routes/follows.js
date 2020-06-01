const express = require("express");

const router = express.Router();

const followCtrl = require("../controllers/follows");

router.post("/addFollow", followCtrl.addFollow);

module.exports = router;
