require('dotenv').config();
const mongoose = require('mongoose')

const uri = process.env.NODE_ENV === 'development' ? process.env.DB_URI : process.env.DB_ATLAS_URI;

const connection = mongoose
    .connect( uri,    
        {useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true})
    .then( dbConnectionResult => {
        console.log(`Connected to Mongo! Database name: ${dbConnectionResult.connections[0].name}`)
    })
    .catch( err => {
        console.log('Error connecting to Mongo', err);
    });

module.exports = connection;