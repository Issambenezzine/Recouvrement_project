const express = require('express');
const router = express.Router();
const authController = require('../controller/authController');
const {register,login} = require("../controller/authGestionnaireController")


router.post('/register', register);
router.post('/login', login);


module.exports = router;
