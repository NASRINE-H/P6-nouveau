// le package JWT permet de créer les token et les verifier 
const jwt = require('jsonwebtoken');
//Bcrypt est une bibliothèque de hachage de mot de passe qui permet de stocker les mots de passe de manière sécurisée.
// Elle est utilisée pour stocker les mots de passe de manière chiffrée dans une base de données.
const bcrypt = require('bcrypt');
const User = require('../models/user');

exports.signup = (req, res, next) => {
    //on crypte le mot de passe avec la fonction hach qui va hacher le mot de passe 10 fois 
    bcrypt.hash(req.body.password, 10)
        //on va recupérer le hach de mot de passe qu'on va ensuite l'enregestrer dans un nouveu user qui va etre enregestrer dans la 
        //base de donnés / User c'est le modele mongoose/ Save pour sauvgarder l'utilisateur
        .then(hash => {
            const user = new User({
                email: req.body.email,
                password: hash
            });
            user.save()
                .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
                .catch(error => res.status(400).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
};
//En résumé, l'authentification est le processus de vérification de l'identité de l'utilisateur,
//tandis que l'autorisation est le processus de vérification des droits d'accès de l'utilisateur à des ressources spécifiques.
// Les deux concepts sont souvent utilisés ensemble pour garantir la sécurité des applications informatiques.

exports.login = (req, res, next) => {
    User.findOne({ email: req.body.email })
        .then(user => {
            if (user === null) {
                res.status(401).json({ message: 'Paire login/mot de passe incorrecte' });
            } else {
                bcrypt.compare(req.body.password, user.password)
                    //Nous utilisons la fonction compare de bcrypt pour comparer le mot de passe entré par 
                    //l'utilisateur avec le hash enregistré dans la base de données

                .then(valid => {
                        if (!valid) {
                            res.status(401).json({ message: 'Paire login/mot de passe incorrecte' });
                        } else {
                            res.status(200).json({
                                userId: user._id,
                                token: jwt.sign({
                                        userId: user._id
                                    },
                                    'RANDOM_TOKEN_SECRET', { expiresIn: '24h' })
                            });
                        }

                    })
                    .catch(error => {
                        res.status(500).json({ error })
                    });
            }
        })
        .catch(error => {
            res.status(500).json({ error })
        });
};