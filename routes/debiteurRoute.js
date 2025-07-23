const express = require('express');
const router = express.Router();
const {debiteurInfo} = require("../controller/debiteurController.js")


router.get('/info/:cin',debiteurInfo);

module.exports = router;