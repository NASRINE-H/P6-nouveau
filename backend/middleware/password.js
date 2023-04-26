const passwordValidator = require('password-validator');



//Schéma de mot de passe plus sécure
const passwordSchema = new passwordValidator();
// Contraintes du mot de passe
passwordSchema
    .is().min(8)
    .is().max(100)
    .has().uppercase()
    .has().lowercase()
    .has().digits()
    .has().not().spaces()

module.exports = (req, res, next) => {
    if (passwordSchema.validate(req.body.password)) {
        next();

    } else {
        return res.status(400).json({ error: "mot de passe faux" })
    }
};