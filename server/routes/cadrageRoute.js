const express = require('express');
const router = express.Router();
const {sendCadrages} = require("../controller/cadrageController.js")



router.get('/info/:id',sendCadrages);

module.exports = router;