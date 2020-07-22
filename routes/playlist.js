var express = require('express');
var router = express.Router();
const beatModel = require('../models/Beats');

//* get all songs from specific type
router.get('/:id', function(req, res, next) {
    console.log(req.params.id)
    beatModel
        .find( { type: { $eq: req.params.id } } )
        .then( dbRes => {
            res.status(200).json(dbRes)
            console.log(dbRes)
        })
        .catch(  err => console.log(err))
})

//* get all songs from specific artist
router.get('/artist/:id', (req, res) => {
    beatModel
        .find( { artist: { $eq: req.params.id } } )
        .then( dbRes => {
            res.status(200).json(dbRes)
        })
        .catch( err => console.log(err))
})

module.exports = router;