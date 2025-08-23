const express = require("express")
const { authorize } = require("../middlewares/auth")
const { getPatrimoinsCadrage } = require("../controller/patrimoinsController")
const router = express.Router()


router.post("/get",authorize, getPatrimoinsCadrage)


module.exports = router