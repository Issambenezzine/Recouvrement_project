const express = require("express")
const router = express.Router()

const {addPieceJointe,getPieceJointe} = require("../controller/PieceJointeController.js")
const { authorize } = require("../middlewares/auth.js")

router.post("/save",addPieceJointe)
router.get("/get/:dossierId",authorize,getPieceJointe)




module.exports = router