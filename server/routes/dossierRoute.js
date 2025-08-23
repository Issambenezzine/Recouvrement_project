const express = require("express");
const router = express.Router();
const {
  checkIfDossierIsBacklog,
  checkIfDossierShouldBeTreatedToday,
  searchDossiers,
  getDossierDetails,
  affecterDossiers,
} = require("../controller/dossierController.js");
const { authorize } = require("../middlewares/auth.js");

router.post("/check1",checkIfDossierIsBacklog)
router.post("/check2",checkIfDossierShouldBeTreatedToday)
router.get("/search/:search",searchDossiers)
router.get("/dossiers",getDossierDetails)
router.post("/affecter",authorize,affecterDossiers)

module.exports = router;