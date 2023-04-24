const { createProxyMiddleware } = require('http-proxy-middleware');
// dans ce fichier on va placer notre application expressconst express = require('express ');
const express = require('express');

//la methode express() pour créer une application express
const app = express();
const path = require('path');
//const helmet = require('helmet');
const bodyParser = require('body-parser');

const sauceRoutes = require('./routes/sauce');
const userRoutes = require('./routes/user');

//Le package Mongoose facilite les interactions entre  l'application Express et la base de données MongoDB.
const mongoose = require('mongoose');

//est une méthode middleware dans le framework web Express de Node.js qui permet de traiter les données JSON
//dans les requêtes HTTP POST, PUT, DELETE, etc. envoyées à un serveur.(on a la accés a req.body)
app.use(express.json());


//En résumé, la différence entre MySQL et MongoDB réside dans leur approche de stockage de données,
// avec MySQL étant une base de données relationnelle classique avec des tables,
//des colonnes et des relations, tandis que MongoDB est une base de données orientée 
//document qui stocke des données sous forme de documents JSON sans schéma prédéfini.
mongoose.connect('mongodb+srv://ines:BWv0UXB98mN5aD4O@cluster0.yddovd8.mongodb.net/?retryWrites=true&w=majority', {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'));



//La méthode app.use() vous permet d'attribuer un middleware à une route spécifique de votre application.
//CORS c'est une sécurité qui permet d'empecher des requetes malveillantes d'acceder a des ressources dans
//les quelles ils n 'ont pas le droit d'acceder
//si on ajoute le code néssécaire tout le monde peut accéder a notre API depuis sont navigateur 
//origin : c'est notre API / * : c'est pour tout le monde (d'accéder à notre API depuis n'importe quelle origine)
//Headers : on donne l'autorisation d'utiliser certain en tete 
//Methodes : on donne l'autorisation d'utiliser certainne méthodes  
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');

    next();
});
const apiProxy = createProxyMiddleware('/api', {
    target: 'http://localhost:4200',
    changeOrigin: true,
});



app.use('/api/sauces', sauceRoutes);
app.use('/api/auth', userRoutes);
app.use('/images', express.static(path.join(__dirname, 'images')));
//app.use(helmet());
app.use('/api', apiProxy);


module.exports = app;


//En résumé, la différence entre MySQL et MongoDB réside dans leur approche de stockage de données,
// avec MySQL étant une base de données relationnelle classique avec des tables,
//des colonnes et des relations, tandis que MongoDB est une base de données orientée 
//document qui stocke des données sous forme de documents JSON sans schéma prédéfini.