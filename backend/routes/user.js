const express = require('express');
const router = express.Router();

const userCtrl = require('../controllers/user');

const Password = require('../middleware/password');

const Email = require('../middleware/email');
//on utilise des routes poste parceque le frontend va nous envoyer des informations (email + MDP)
router.post('/signup', Email, Password, userCtrl.signup);
router.post('/login', userCtrl.login);

module.exports = router;