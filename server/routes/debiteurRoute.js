const express = require('express');
const router = express.Router();
const {debiteurInfo, getDebiteurAddresse} = require("../controller/debiteurController.js")


router.get('/info/:cin',debiteurInfo);
router.post("/adresse",getDebiteurAddresse)

module.exports = router;