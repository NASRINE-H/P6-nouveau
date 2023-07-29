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


app.use('/api/sauces', sauceRoutes);
app.use('/api/auth', userRoutes);
app.use(helmet({
    crossOriginResourcePolicy: false,
    crossOriginEmbedderPolicy: false, // ...
}));
//Une route statique est également définie pour servir les fichiers image qui seront stockés dans le dossier "images".
app.use('/images', express.static(path.join(__dirname, 'images')));

module.exports = app;