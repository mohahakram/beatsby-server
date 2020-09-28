const express = require('express');
const router = express.Router();
const User = require('../models/Users');
const Beat = require('../models/Beats');
const Cart = require('../models/Carts');
const Favourites = require('../models/Favourites');
const passportConfig = require('../config/passport');

// * get dashboard of logged in user
router.get('/', (req, res) => {
    // deconstruct from req object to access variables globaly
    const { user } = req;
    //find user depending on user id
    User.findOne({ _id: user.id })
    //exclude password from response
    .select("-password")
    // fetch from beats, cart, favourites collection and populate with matching ids
    .populate({path: 'cart',
        populate: {path: 'cartList'}
    })
    .populate({path: 'favourites',
        populate: {path: 'favouriteList'}})
    .populate('beats')
        .then((list) => {
            //if error send back message or send db response
            if (!list) {
                res.status(500).json({message: "something went wrong"});
            }
            res.status(200).send(list) 
        }).catch((err) =>
            console.log(err)
        )
})

module.exports = router;