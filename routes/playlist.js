var express = require('express');
var router = express.Router();
const Beat = require('../models/Beats');

//* get all songs from specific type
router.get('/:id', function(req, res, next) {
    // replace any '-' to space as types in db dont have '-' character
    const type = req.params.id.replace('-',' ')
    Beat
        .find( { type: { $eq: type } } )
        .then( dbRes => {
            res.status(200).json(dbRes)
            console.log(dbRes)
        })
        .catch(  err => console.log(err))
})

//* get all songs from specific artist
router.get('/artist/:id', (req, res) => {
    Beat
        .find( { artist: { $eq: req.params.id } } )
        .then( dbRes => {
            res.status(200).json(dbRes)
        })
        .catch( err => console.log(err))
})

module.exports = router;