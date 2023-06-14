const mongoose = require('mongoose');
//La méthode  Schema  de Mongoose nous permet de créer un schéma de données pour notre base de données MongoDB.
const sauceSchema = mongoose.Schema({
        //l'identifiant MongoDB unique de l'utilisateur qui a créé la sauce
        userId: { type: String, required: true },
        name: { type: String, required: true },
        manufacturer: { type: String, required: true },
        description: { type: String, required: true },
        mainPepper: { type: String, required: true },
        imageUrl: { type: String, required: true },
        heat: {
            type: Number,
            required: true,
            min: 1,
            max: 10,

        },
        likes: { type: Number, default: 0 },
        dislikes: { type: Number, default: 0 },
        usersLiked: { type: [String] },
        usersDisliked: { type: [String] }
    })
    //La méthode  model  transforme ce modèle en un modèle utilisable.
module.exports = mongoose.model('Sauce', sauceSchema);