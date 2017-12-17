var MongooseSeed = require('mongoose-seed-db')
const path = require('path')

// import MongooseSeed from 'mongoose-seed-db'; //ES6

MongooseSeed.connect('mongodb://localhost:27017/nodepop').then(() => {
  MongooseSeed.loadModels(path.join(__dirname, '/../models'))
  MongooseSeed.clearAll().then(() => {
    MongooseSeed.populate(path.join(__dirname, '/../data')).then(() => {
      process.exit()
    })
  })
})
