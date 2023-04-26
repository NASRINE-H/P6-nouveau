const express = require('express');
const router = express.Router();

const userCtrl = require('../controllers/user');

const Password = require('../middleware/password');


router.post('/signup', Password, userCtrl.signup);
router.post('/login', userCtrl.login);

module.exports = router;