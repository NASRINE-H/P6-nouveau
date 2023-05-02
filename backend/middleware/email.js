const validator = require("validator"); // Importation du package 'validator'

// VERIFICATION DE L'ADRESSE MAIL : Middleware de vérification de l'adresse mail
module.exports = function(req, res, next) {
    // Si l'adresse mail n'est pas valide
    if (!validator.isEmail(req.body.email)) {
        return res
            .status(400)
            .json({ message: "Veuillez saisir une adresse mail valide !" });
    } else {
        next();
    }
};