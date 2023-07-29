//ce fichier contient la logique de routing
const express = require('express');
const auth = require('../middleware/auth');
//La méthode express.Router() nous permet de créer des routeurs séparés pour chaque route principale de notre application
const router = express.Router();


const multer = require('../middleware/multer-config')
const sauceCtrl = require('../controllers/sauce');

router.post('/', auth, multer, sauceCtrl.creatSauce);

router.get('/:id', auth, sauceCtrl.getOneSauce);

router.get('/', auth, sauceCtrl.getAllSauces);

router.put('/:id', auth, multer, sauceCtrl.modifySauce);

router.delete('/:id', auth, sauceCtrl.deleteSauce);
router.post('/:id/like', auth, sauceCtrl.likeDislikeSauce);



module.exports = router;