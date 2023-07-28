const http = require('http');
const app = require('./app');
//(pour la gestion des variables d'environnement).
require('dotenv').config();

const normalizePort = val => {
    const port = parseInt(val, 10);

    if (isNaN(port)) {
        return val;
    }
    if (port >= 0) {
        return port;
    }
    return false;
};

//la fonction normalizePort renvoie un port valide, qu 'il soit fourni sous la forme d'entier ;
const port = normalizePort(process.env.PORT ||  '3000');
app.set('port', port);
//Cette fonction est appelée en cas d'erreur lors de l'écoute du serveur
const errorHandler = error => {
    if (error.syscall !== 'listen') {
        throw error;
    }
    const address = server.address();
    const bind = typeof address === 'string' ? 'pipe ' + address : 'port: ' + port;
    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges.');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use.');
            process.exit(1);
            break;
        default:
            throw error;
    }
};

const server = http.createServer(app);

server.on('error', errorHandler);
server.on('listening', () => {
    const address = server.address();
    const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + port;
    console.log('Listening on ' + bind);
});

server.listen(port);

//En résumé, ce fichier server.js configure un serveur HTTP qui écoute les requêtes entrantes sur un port spécifié.
// Il utilise l'application définie dans app.js pour gérer les requêtes, et gère les erreurs potentielles liées à l'écoute du serveur.