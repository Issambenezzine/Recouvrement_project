const express = require("express")
const router = express.Router()
const {getBanques} = require("../controller/BanqueController.js")
const { authorize } = require("../middlewares/auth.js")


router.post("/get",authorize,getBanques)

module.exports = router