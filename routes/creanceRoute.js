const express = require('express');
const router = express.Router();
const {sendCreances} = require("../controller/creanceController.js")



router.get('/info/:id',sendCreances);

module.exports = router;