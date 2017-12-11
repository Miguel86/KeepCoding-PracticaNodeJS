'use strict';

const mongoose = require('mongoose');

// primero creamos el esquema
const usuarioSchema = mongoose.Schema({
    nombre: String,
    email: {type: String, index: true},
    clave: String
});
//Creamos un método estático
usuarioSchema.statics.list = function(filters) {
    const query = Usuario.find(filters);
    return query.exec();
}

//Creamos un método estático
usuarioSchema.statics.poremail = function(filters) {
    const query = Usuario.findOne(filters);
    return query.exec();
}

//y por último creamos el modelo
const Usuario = mongoose.model('Usuario', usuarioSchema);

//y lo exportamos
module.exports = Usuario;