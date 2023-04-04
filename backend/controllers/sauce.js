//ce fichier contient la logique de métier

exports.creatSauce = (req, res, next) => {
    //supprimé en amont le faux_id envoyé par le front-end
    delete req.body._id;
    const sauce = new Sauce({
        //L'opérateur spread ... est utilisé pour faire une copie 
        //de tous les éléments de req.body
        ...req.body
    });
    // méthode save() qui enregistre simplement votre Thing dans la base de données.
    sauce.save()
        .then(() => res.status(201).json({ message: 'Sauce enregistré !' }))
        .catch(error => res.status(400).json({ error }));
};

exports.getOneSauce = (req, res, next) => {
    //findOne()  retourne une seul sauce basé sur la fonction de comparaison qu'on lui passe 

    Sauce.findOne({ _id: req.params.id })
        .then(sauce => res.status(200).json(sauce))
        .catch(error => res.status(404).json({ error: error }));
};

exports.getAllSauce = (req, res, next) => {
    // find() pour renvoyer un tableau contenant tous les sauces dans notre base de données
    Sauce.find()
        .then(sauces => res.status(200).json(sauces))
        .catch(error => res.status(400).json({ error }));
};

exports.modifySauce = (req, res, next) => {

    const sauce = new Sauce({
        //L'opérateur spread ... est utilisé pour faire une copie 
        //de tous les éléments de req.body
        ...req.body
    });
    //updateOne()  nous permet de mettre à jour la sauce
    //req.body c'est la nouvelle version de l'objet et _id pour qu'on soit sur c'est le meme identifiant qui existe dans la route 
    //nous devons utiliser le paramètre id de la requête pour configurer notre sauce avec le même _id qu'avant.
    Sauce.updateOne({ _id: req.params.id }, sauce)
        .then(() => res.status(200).json({ message: 'Sauce modifié !' }))
        .catch(error => res.status(400).json({ error: error }));
};

exports.deleteSauce = (req, res, next) => {
    Sauce.deleteOne({ _id: req.params.id })
        .then(() => res.status(200).json({ message: 'Sauce supprimé !' }))
        .catch(error => res.status(400).json({ error }));
};