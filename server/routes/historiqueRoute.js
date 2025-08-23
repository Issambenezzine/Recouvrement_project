const { getHistorique } = require("../controller/historiqueController")
const { authorize } = require("../middlewares/auth.js")

const express = require("express")
const router = express.Router()


router.get("/get/:id",authorize, getHistorique)

module.exports = router