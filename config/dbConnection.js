require('dotenv').config();
const mongoose = require('mongoose')

// check for environment to set the right db URI
const uri = process.env.NODE_ENV === 'production' ? process.env.DB_ATLAS_URI : process.env.DB_URI

const connection = mongoose
    .connect( uri,    
        {useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true,
        useFindAndModify: false
    })
    .then( dbConnectionResult => {
        console.log(`Connected to Mongo! Database name: ${dbConnectionResult.connections[0].name}`)
    })
    .catch( err => {
        console.log('Error connecting to Mongo', err);
    });

module.exports = connection;