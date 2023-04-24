//ce fichier contient la logique de métier
const Sauce = require('../models/sauce');
const fs = require('fs');
exports.creatSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);

    //on suprime _id parceque va etre generer par BDD
    delete sauceObject._id;
    //on suprime userId qui a créé l'objet parceque il faut jamais fair confinace au clients et on utilse le userId qui vien de token
    delete sauceObject._userId;
    const sauce = new Sauce({
        //L'opérateur spread ... est utilisé pour faire une copie 
        //de tous les éléments de req.body
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

    //fondOne utilisée pour chercher un seul document dans une collection MongoDB en fonction de critères de recherche spécifiés
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


//updateOne()  nous permet de mettre à jour la sauce
//req.body c'est la nouvelle version de l'objet et _id pour qu'on soit sur c'est le meme identifiant qui existe dans la route 
//nous devons utiliser le paramètre id de la requête pour configurer notre sauce avec le même _id qu'avant.
exports.modifySauce = (req, res, next) => {
    const sauceObject = req.file ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : {...req.body };

    delete sauceObject._userId;
    Sauce.findOne({ _id: req.params.id })
        .then((sauce) => {
            if (sauce.userId != req.auth.userId) {
                res.status(401).json({ message: 'Not authorized' });
            } else {
                Sauce.updateOne({ _id: req.params.id }, {...sauceObject, _id: req.params.id })
                    .then(() => res.status(200).json({ message: 'Sauce modifié!' }))
                    .catch(error => res.status(401).json({ error }));
            }
        })
        .catch((error) => {
            res.status(400).json({ error });
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
    console.log("je suis dans le controller ");
    //récuperer le body de la requete qui sera envoyé par le body sous format json avec 2 proprieté userId et like 
    console.log("contenu req body.userId", req.body.like);
    //récuperer l'id de la sauce correspondante dans la BDD
    console.log("controller", { _id: req.params.id });
    //récupérer la sauce dans la BDD 
    Sauce.findOne({ _id: req.params.id })
        .then((sauce) => {
            console.log(sauce);
            //like=1(likes = +1)
            //utilisation de la méthode javascript includes() /La méthode includes() permet de déterminer si un tableau contient une valeur et renvoie true si c'est le cas, false sinon.
            //utilisation de l'opération $inc
            //utilisation de l'opération $push
            //utilisation de l'opération $pull

            //si le userId est n'existe pas dans le tableau userliked/userdisliked et si like ===1
            if (!(sauce.usersLiked.includes(req.body.userId) || sauce.usersDisliked.includes(req.body.userId)) && (req.body.like === 1)) {
                console.log("userId n'est pas dans usersLiked BDD et requete front like a 1")
                    //mis a jour BDD
                Sauce.updateOne({ _id: req.params.id }, {
                        //L' $inc opérateur incrémente un champ d'une valeur spécifiée
                        $inc: { likes: 1 },
                        //Le $push L'opérateur ajoute une valeur spécifiée à un tableau.
                        $push: { usersLiked: req.body.userId }
                    })
                    .then(() => res.status(201).json({ message: "vous avez liké +1" }))
                    .catch((error) => res.status(400).json({ error }));
            }
            //like=0 (si on veut enlever le like)
            else if (sauce.usersLiked.includes(req.body.userId) && req.body.like === 0) {
                console.log("like=0");
                //mise a jour BDD
                Sauce.updateOne({ _id: req.params.id }, {
                        //L' $inc opérateur incrémente un champ d'une valeur spécifiée
                        $inc: { likes: -1 },
                        //Le $pull L 'opérateur supprime d'un tableau existant toutes les instances d 'une valeur ou de valeurs qui correspondent à une condition spécifiée.
                        $pull: { usersLiked: req.body.userId }
                    })
                    .then(() => res.status(201).json({ message: "vous avez liké 0" }))
                    .catch((error) => res.status(400).json({ error }));

            } // si userId fait dislike
            else if (!(sauce.usersLiked.includes(req.body.userId) || sauce.usersDisliked.includes(req.body.userId)) && req.body.like === -1) {
                console.log("userId n'est pas dans usersDisLiked BDD et requete front dislike = 1")
                    //mis a jour BDD
                Sauce.updateOne({ _id: req.params.id }, {
                        //L' $inc opérateur incrémente un champ d'une valeur spécifiée
                        $inc: { dislikes: 1 },
                        //Le $push L'opérateur ajoute une valeur spécifiée à un tableau.
                        $push: { usersDisliked: req.body.userId }
                    })
                    .then(() => res.status(201).json({ message: "vous avez disliké +1" }))
                    .catch((error) => res.status(400).json({ error }));


            } else if (sauce.usersDisliked.includes(req.body.userId) && req.body.like === 0) {
                console.log("like=0");
                //mise a jour BDD
                Sauce.updateOne({ _id: req.params.id }, {
                        //L' $inc opérateur incrémente un champ d'une valeur spécifiée
                        $inc: { dislikes: -1 },
                        //Le $pull L 'opérateur supprime d'un tableau existant toutes les instances d 'une valeur ou de valeurs qui correspondent à une condition spécifiée.
                        $pull: { usersDisliked: req.body.userId }
                    })
                    .then(() => res.status(201).json({ message: "vous avez liké 0" }))
                    .catch((error) => res.status(400).json({ error }));

            } else {
                console.log("userId existe deja , il ne peux pas faire like qu'une seule fois")
                throw error = new Error("opération non autorisée");
            }
        })
        .catch((error) => res.status(404).json({
            error: "On ne peut liker une sauce qu'une seule fois"
        }));
}