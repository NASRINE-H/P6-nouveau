//sera utilisé pour rediriger les requêtes vers le frontend Angular qui sera exécuté sur un autre serveur.
//const { createProxyMiddleware } = require('http-proxy-middleware');
// dans ce fichier on va placer notre application express const express = require('express ');

const express = require('express');
const helmet = require("helmet");
require('dotenv').config();
//la methode express() pour créer une application express
const app = express();

const path = require('path');
const sauceRoutes = require('./routes/sauce');
const userRoutes = require('./routes/user');
//Le package Mongoose facilite les interactions entre  l'application Express et la base de données MongoDB.
const mongoose = require('mongoose');
//est une méthode middleware dans le framework web Express de Node.js qui permet de traiter les données JSON
//dans les requêtes HTTP POST, PUT, DELETE, etc. envoyées à un serveur.(on a la accés a req.body)
app.use(express.json());
mongoose.connect(process.env.DB_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});
//Le code commence par importer les modules nécessaires, notamment le module "http-proxy-middleware" 
//qui sera utilisé pour rediriger les requêtes
// vers le frontend Angular qui sera exécuté sur un autre serveur.
// La fonction createProxyMiddleware() crée un middleware qui redirige toutes les demandes qui commencent 
//par "/api" vers le serveur Angular exécuté sur "http://localhost:4200".
/*const apiProxy = createProxyMiddleware('/api', {
    target: 'http://localhost:4200',
    changeOrigin: true,
});*/
//La méthode app.use() vous permet d'attribuer un middleware à une route spécifique de votre application.
// Les routes définissent les points d'entrée de l'API et spécifient les actions à effectuer pour chaque route.
app.use('/api/sauces', sauceRoutes);
app.use('/api/auth', userRoutes);
//helmet est un package sécurité pour ton api, il sert a éviter les failles de sécurité classiques,
// il doit donc être utiliser sur  endpoint, avant de traiter la requetes
app.use(helmet({
    crossOriginResourcePolicy: false,
    crossOriginEmbedderPolicy: false, // ...
}));
//Une route statique est également définie pour servir les fichiers image qui seront stockés dans le dossier "images".
app.use('/images', express.static(path.join(__dirname, 'images')));
//app.use('/api', apiProxy);

module.exports = app;


//En résumé, la différence entre MySQL et MongoDB réside dans leur approche de stockage de données,
// avec MySQL étant une base de données relationnelle classique avec des tables,
//des colonnes et des relations, tandis que MongoDB est une base de données orientée 
//document qui stocke des données sous forme de documents JSON sans schéma prédéfini.


//La méthode app.use() vous permet d'attribuer un middleware à une route spécifique de votre application.
//CORS c'est une sécurité qui permet d'empecher des requetes malveillantes d'acceder a des ressources dans
//les quelles ils n 'ont pas le droit d'acceder
//si on ajoute le code néssécaire tout le monde peut accéder a notre API depuis sont navigateur 
//origin : c'est notre API / * : c'est pour tout le monde (d'accéder à notre API depuis n'importe quelle origine)
//Headers : on donne l'autorisation d'utiliser certain en tete 
//Methodes : on donne l'autorisation d'utiliser certainne méthodes