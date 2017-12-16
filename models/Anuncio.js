'use strict';

const mongoose = require('mongoose');

// primero creamos el esquema
const anuncioSchema = mongoose.Schema({
    nombre: String,
    venta: Boolean,
    precio: Number,
    foto: String,
    tags: {type: [String], index: true}
});
//Creamos un método estático
anuncioSchema.statics.list = function(filters, limit, skip, sort, fields) {
    const query = Anuncio.find(filters);
    query.limit(limit);
    query.skip(skip);
    query.sort(sort);
    query.select(fields);

    return query.exec();
}
//Creamos un método estático
anuncioSchema.statics.listTags = function() {
    const anunciosCollection = mongoose.connection.collection("anuncios");
    return(anunciosCollection.distinct("tags"));
}

//y por último creamos el modelo
const Anuncio = mongoose.model('Anuncio', anuncioSchema);
//y lo exportamos
module.exports = Anuncio;