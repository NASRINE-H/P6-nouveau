const mongoose = require('mongoose');

//La méthode  Schema  de Mongoose nous permet de créer un schéma de données pour notre base de données MongoDB.
const sauceSchema = mongoose.Schema({
            //— l'identifiant MongoDB unique de l'utilisateur qui a créé la sauce

            userId: { type: String, required: true },
            //— nom de la sauce
            name: { type: String, required: true },
            //fabricant de la sauce
            manufacturer: { type: String, required: true },
            //description de la sauce

            description: { type: String, required: true },
            //le principal ingrédient épicé de la sauce
            mainPepper: { type: String, required: true },
            //l'URL de l'image de la sauce téléchargée par l'utilisateur
            imageUrl: { type: String, required: true },
            //nombre entre 1 et 10 décrivant la sauce
            heat: { type: Number, required: true },
            //nombre d'utilisateurs qui aiment  la sauce
            likes: { type: Number, required: true },
            // nombre d'utilisateurs qui n'aiment pas ) la sauce
            dislikes: { type: String, required: true },
            //tableau des identifiants des utilisateurs qui ont aimé( liked) la sauce

            usersLiked: { type: [String] },
            //tableau des identifiants des utilisateurs qui n'ont pas aimé (disliked) la sauce

            usersDisliked: {
                type: [String]
            }
        }




    )
    //La méthode  model  transforme ce modèle en un modèle utilisable.
module.exports = mongoose.model('Sauce', sauceSchema);