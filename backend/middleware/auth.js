const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
        //on divise la chaine de caractère bearer et token dans un tableau 0  1 et on recupère split 1 c'est le token 
        const token = req.headers.authorization.split(' ')[1];
        //  la fonction verify pour décoder notre token. Si ce n'est pas valide, une erreur sera générée.
        //La méthode verify() du package jsonwebtoken permet de vérifier la validité d'un token
        const decodedToken = jwt.verify(token, process.env.SECRET_TOKEN);
        //Nous extrayons l'ID utilisateur de notre token et le rajoutons à l’objet Request afin que nos différentes routes puissent l’exploiter.
        const userId = decodedToken.userId;
        req.auth = {
            userId: userId
        };
        next();
    } catch (error) {
        res.status(401).json({ error });
    }
};