//ce fichier contient la logique de métier
const Sauce = require('../models/sauce');
const fs = require('fs');


exports.creatSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);

    //on suprime _id parceque va etre generer par BDD
    delete sauceObject._id;
    delete sauceObject._userId;
    const sauce = new Sauce({

        ...sauceObject,

        userId: req.auth.userId,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
        likes: 0,
        dislikes: 0,
        usersLiked: [],
        usersDisliked: []

    });
    // méthode save() enregistre  notre sauce  dans la base de données.
    sauce.save()
        .then(() => res.status(201).json({ message: 'Sauce enregistré !' }))
        .catch(error => res.status(400).json({ error: error }));
};

exports.getOneSauce = (req, res, next) => {
    //req.params.id permettra d'accéder à la valeur de l'ID de l'article demandé par l'utilisateur.
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => res.status(200).json(sauce))
        .catch(error => res.status(404).json({ error: error }));
};

exports.getAllSauces = (req, res, next) => {
    // find() pour renvoyer un tableau contenant tous les sauces dans notre base de données
    Sauce.find()
        .then(sauces => res.status(200).json(sauces))
        .catch(error => res.status(400).json({ error }));
};


exports.modifySauce = (req, res, next) => {
    const sauceObject = req.file ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : {...req.body };
    delete sauceObject._userId;

    Sauce.findOne({ _id: req.params.id })
        .then((sauce) => {
            if (sauce.userId !== req.auth.userId) {
                res.status(403).json({ message: 'Modification non autorisée' });
            } else {
                const oldImage = sauce.imageUrl;

                Sauce.updateOne({ _id: req.params.id }, {...sauceObject, _id: req.params.id }, { runValidators: true })
                    .then(() => {

                        if (req.file && oldImage) {

                            fs.unlink(`images/${oldImage.split('/').pop()}`, (err) => {
                                if (err) {
                                    console.error('Error deleting old image:', err);
                                }
                            });
                        }
                        res.status(200).json({ message: 'Sauce modifiée !' });
                    })
                    .catch(() => res.status(403).json({ error: "Modification impossible" }));
            }
        })
        .catch((error) => {
            res.status(400).json({ error: "Sauce introuvable" });
        });
};

exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => {
            if (sauce.userId != req.auth.userId) {
                res.status(401).json({ message: 'Not authorized' });
            } else {
                const filename = sauce.imageUrl.split('/images/')[1];
                fs.unlink(`images/${filename}`, () => {
                    Sauce.deleteOne({ _id: req.params.id })
                        .then(() => { res.status(200).json({ message: 'Sauce supprimé !' }) })
                        .catch(error => res.status(401).json({ error }));
                });
            }
        })
        .catch(error => {
            res.status(500).json({ error });
        });
};

exports.likeDislikeSauce = (req, res, next) => {

    //récupérer la sauce dans la BDD 
    Sauce.findOne({ _id: req.params.id })
        .then((sauce) => {
            //si le userId est n'existe pas dans le tableau userliked/userdisliked et si like ===1
            if (!(sauce.usersLiked.includes(req.auth.userId) || sauce.usersDisliked.includes(req.auth.userId)) && (req.body.like === 1)) {
                //mis a jour BDD
                Sauce.updateOne({ _id: req.params.id }, {
                        //L' $inc pour incrémenter une valeur
                        $inc: { likes: 1 },
                        //Le $push L'opérateur pouer ajouter une valeur 
                        $push: { usersLiked: req.auth.userId }
                    })
                    .then(() => res.status(201).json({ message: "vous avez liké +1" }))
                    .catch((error) => res.status(400).json({ error }));
            }
            //like=0 (si on veut enlever le like)
            else if (sauce.usersLiked.includes(req.auth.userId) && req.body.like === 0) {

                //mise a jour BDD
                Sauce.updateOne({ _id: req.params.id }, {

                        $inc: { likes: -1 },
                        $pull: { usersLiked: req.auth.userId }
                    })
                    .then(() => res.status(201).json({ message: "vous avez liké 0" }))
                    .catch((error) => res.status(400).json({ error }));

            } // si userId fait dislike
            else if (!(sauce.usersLiked.includes(req.auth.userId) || sauce.usersDisliked.includes(req.auth.userId)) && req.body.like === -1) {

                Sauce.updateOne({ _id: req.params.id }, {

                        $inc: { dislikes: 1 },

                        $push: { usersDisliked: req.auth.userId }
                    })
                    .then(() => res.status(201).json({ message: "vous avez disliké +1" }))
                    .catch((error) => res.status(400).json({ error }));


            } else if (sauce.usersDisliked.includes(req.auth.userId) && req.body.like === 0) {

                Sauce.updateOne({ _id: req.params.id }, {

                        $inc: { dislikes: -1 },

                        $pull: { usersDisliked: req.auth.userId }
                    })
                    .then(() => res.status(201).json({ message: "vous avez liké 0" }))
                    .catch((error) => res.status(400).json({ error }));

            } else {

                throw error = new Error("opération non autorisée");
            }
        })
        .catch((error) => res.status(404).json({
            error
        }));
}