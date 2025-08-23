const express = require("express")
const route = express.Router()
const {getEmployeur, getEmployeurCadrage} = require("../controller/employeurController.js")
const { authorize } = require("../middlewares/auth.js")

route.get("/get/:debiteurId", authorize,getEmployeur)
route.post("/getCadrage",authorize,getEmployeurCadrage)

module.exports = route