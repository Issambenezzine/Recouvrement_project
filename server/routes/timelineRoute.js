const express = require("express");
const router = express.Router();
const {getTimeline} = require("../controller/timelineController.js");
const { authorize } = require("../middlewares/auth.js");

router.post("/get",authorize,getTimeline)


module.exports = router;
