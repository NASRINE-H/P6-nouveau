const mongoose = require('mongoose');

//la valeur unique avec l'élément mongoose-unique-validator passé comme plug-in
// s'assurera que deux utilisateurs ne puissent pas partager la même adresse e-mail.
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);