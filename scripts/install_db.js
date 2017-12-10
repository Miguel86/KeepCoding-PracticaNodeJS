var MongooseSeed = require('mongoose-seed-db');
//import MongooseSeed from 'mongoose-seed-db'; //ES6 
 
MongooseSeed.connect('mongodb://localhost:27017/nodepop').then(() => {
    MongooseSeed.loadModels(__dirname + '/../models');
    MongooseSeed.clearAll().then(() => {
        MongooseSeed.populate(__dirname + '/../data').then(() => {
            process.exit();
        });
    });
});