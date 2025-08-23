const express = require("express")
const { authorize } = require("../middlewares/auth")
const { addGestionnaireCommentaire, addResponsableCommentaire, fetchComments } = require("../controller/commentaireController")
const route = express.Router()


route.put("/gestionnaire",authorize,addGestionnaireCommentaire)
route.put("/responsable",authorize,addResponsableCommentaire)
route.get("/get/:id",authorize, fetchComments)


module.exports = route