// le package JWT permet de créer les token et les verifier 
const jwt = require('jsonwebtoken');
//Bcrypt  est utilisée pour stocker les mots de passe de manière chiffrée dans une base de données.
const bcrypt = require('bcrypt');
const User = require('../models/user');

exports.signup = (req, res, next) => {

    bcrypt.hash(req.body.password, 10)

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
                                //la fonction sign pour chiffrer un nouveau token
                                token: jwt.sign({
                                        userId: user._id
                                    },
                                    process.env.TOKEN_KEY, { expiresIn: '24h' })
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