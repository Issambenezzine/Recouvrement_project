const express = require("express")
const router = express.Router()
const { authorize } = require("../middlewares/auth.js")
const {createAction,getActions, getActionsParFamille, getFamillesAction, getActionsGrouped} = require("../controller/actionController.js")


router.post('/save',authorize,createAction)
router.post("/get",authorize, getActions)
router.get("/getAction/:familleAction",getActionsParFamille)
router.get("/getFamillesAction",getFamillesAction)
router.get("/getActionGrouped",getActionsGrouped)


module.exports = router