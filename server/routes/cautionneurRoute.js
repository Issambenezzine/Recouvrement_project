const express = require("express")
const router = express.Router()

const {getCautionneur} = require("../controller/cautionneurController.js")
const { authorize } = require("../middlewares/auth.js")

router.get("/get/:debiteurId",authorize, getCautionneur)

module.exports = router