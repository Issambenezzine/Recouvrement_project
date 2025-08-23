const express = require("express")
const route = express.Router()
const {saveVisiteur, updateVisiteur, deleteVisiteur} = require("../controller/visiteurController.js")
const {authorize} = require("../middlewares/auth.js")

route.post('/save',authorize,saveVisiteur)
route.put('/update',authorize,updateVisiteur)
route.delete('/delete',authorize,deleteVisiteur)

module.exports = route
