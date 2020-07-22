require('dotenv').config();
const mongoose = require('mongoose')

const connection = mongoose
    .connect(process.env.DB_URI,    {useNewUrlParser: true,
                                    useCreateIndex: true,
                                    useUnifiedTopology: true})
    .then(dbConnectionResult => {
        console.log(`Connected to Mongo! Database name: ${dbConnectionResult.connections[0].name}`)
    })
    .catch( err => {
        console.log('Error connecting to Mongo', err);
    });

    module.exports = connection;