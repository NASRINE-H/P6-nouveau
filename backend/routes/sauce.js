//ce fichier contient la logique de routing
const express = require('express');
//La méthodeexpress.Router() nous permet de créer des routeurs séparés pour chaque route principale de notre application
const router = express.Router();
const Sauce = require('.../models/sauce')

const sauceCtrl = require('../controllers/sauce');

router.post('/', sauceCtrl.creatSauce);

router.get('/:id', sauceCtrl.getOneSauce);

router.get('/', sauceCtrl.getAllSauce);

router.put('/:id', sauceCtrl.modifySauce);

router.delete('/:id', sauceCtrl.deleteSauce);
app.use('/api/sauce', sauceRoutes);
module.exports = router;