//La fonction middleware vérifie si l'adresse e-mail soumise par l'utilisateur est valide en utilisant la fonction isEmail() fournie par le package "validator".
//Si l'adresse e-mail n'est pas valide, le middleware renvoie une réponse avec un code d'état 400 (Bad Request) et un message 
//indiquant à l'utilisateur de saisir une adresse e-mail valide. Si l'adresse e-mail est valide,
//le middleware appelle la fonction next() pour passer au middleware suivant dans la chaîne.

//En somme, ce middleware est utilisé pour s 'assurer que l'
//adresse e - mail soumise par l 'utilisateur est valide avant de passer à la suite du traitement de la requête.
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