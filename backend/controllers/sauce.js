//ce fichier contient la logique de métier
const Sauce = require('../models/sauce');
const fs = require('fs');
exports.creatSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);
    //supprimé en amont le faux_id envoyé par le front-end
    //on suprime id parceque va etre generer pas BDD
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
    // méthode save() qui enregistre simplement notre sauce  dans la base de données.
    sauce.save()
        .then(() => res.status(201).json({ message: 'Sauce enregistré !' }))
        .catch(error => res.status(400).json({ error: error }));
};

exports.getOneSauce = (req, res, next) => {
    //findOne()  retourne une seul sauce basé sur la fonction de comparaison qu'on lui passe 

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
//L'opérateur spread ... est utilisé pour faire une copie 
//de tous les éléments de req.body

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
    const like = req.body.like
    const sauceId = req.params.id
    const userId = req.body.userId

    Sauce.findOne({ _id: req.params.id })
        .then(sauce => {
            //Si like est = 1, le user aime
            const userliked = checkUser(sauce.usersLiked, userId);
            const userDisliked = checkUser(sauce.usersDisliked, userId);
            switch (like) {
                case (1):
                    // on teste le cas où on a reçu un like =1
                    // on vérifie si l'utilisateur
                    // Premier like de l'utilisateur
                    if (!(userliked || userDisliked)) {
                        //let likes = sauce.likes ? sauce.likes : 0;
                        sauce.likes += 1;
                        sauce.usersLiked.push(userId);
                    } else {
                        // l'utilisateur a déjà likeé
                        // On veut éviter like multiple

                        throw new Error("On ne peut liker une sauce qu'une seule fois");
                    }
                    break;
                case (-1):
                    // Premier dislike de l'utilisateur
                    if (!(userliked || userDisliked)) {
                        //let dislikes = sauce.dislikes ? sauce.dislikes : 0;
                        sauce.dislikes += 1;;
                        sauce.usersDisliked.push(userId);
                    } else {
                        // l'utilisateur a déjà likeé
                        // On veut éviter like multiple
                        throw new Error("On ne peut disliker une sauce qu'une seule fois");
                    }
                    break;
                case (0):
                    //on vérifie le userId dans le tableau usersLiked

                    if (userliked) {
                        //retire son like
                        sauce.likes -= 1;
                        //on retire le userid du tableau usersLiked
                        sauce.usersLiked = createNewUserIdArray(sauce.usersLiked, userId);
                    } else {
                        //on cherche dans le tableau des usersDisliked

                        if (userDisliked) {
                            //retire son dislike
                            sauce.dislikes -= 1;
                            //on retire le userid du tableau usersLiked
                            sauce.usersDisliked = createNewUserIdArray(sauce.usersDisliked, userId);
                        }
                    }
                    break;
            }


            //Sauvegarde la sauce modifié dans la base de données mongoDB
            sauce.save()
                //retour promise status OK
                .then(() => res.status(201).json({ message: "choix appliqué" }))
                //retour erreur requète
                .catch(error => res.status(400).json({ error }));

        })
        .catch(error => res.status(500).json({ error: error.message }));
}

function checkUser(userIdArray, userId) {
    return userIdArray.find(id => id === userId);

}

function createNewUserIdArray(userIdArray, userId) {
    return userIdArray.filter(id => id !== userId);
}