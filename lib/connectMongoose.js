'use strict';

const mongoose = require('mongoose');
const conn = mongoose.connection;

mongoose.Promise = global.Promise;

conn.on('error', err =>{
    console.log('Error!', err);
});

mongoose.connect('mongodb://localhost/nodepop', {
    useMongoClient: true
});

conn.once('open', () => {
    console.log(`Conectado a MongoDB en ${mongoose.connection.name}`);
});
module.exports = conn;