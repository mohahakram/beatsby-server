var express = require("express");
var router = new express.Router();
const mongoose = require("mongoose");
const User = require("../models/Users");
const Beat = require("../models/Beats");
const Cart = require("../models/Carts");



//* get cart of specific user
router.get('/', (req, res) => {
    // deconstruc from req object to access variables globaly
    const { user, params } = req;
    //find user cart depending on user id
    Cart.findOne({ userId: user.id })
    // fetch from Beat collection and populate with matching ids
    .populate('cartList')
        .then((list) => {
            //check if user user already has a cart in db
            if (!list) {
                res.status(400).json({message: "cart is empty"});
                
            } else {
                res.status(200).send(list) 
            }
    })
})


//* add to specific user cart
router.post("/add/:id", (req, res) => {
    // deconstruc from req object to access variables globaly
    const { user, params } = req;
    //find user cart depending on user id
    Cart.findOne({ userId: user.id })
        .populate('cartList')
        .then(async (list) => {
            //check if user user already has a cart in db
            if (!list) {
                const newCart = new Cart({
                    userId: user.id,
                    cartList: [params.id],
                });
                //if user doesn't have a cart
                //create cart in database and append it to user
                try {
                    const savedCart = await newCart.save()
                    .then( dbRes =>
                        User.findByIdAndUpdate({_id: user.id}, {cart: dbRes.id}, {upsert: true}),
                        res.status(200).json({message: "added to cart"})
                    )
                    
                } catch (err) {
                    res.status(400).send(err);
                }
            } else {
                //if cart already exists get the _id and
                //loop through array to check for duplicate before updating
                const listId = list.id;
                dbResList = list.cartList;
                updatedList = [...dbResList];

                if ( dbResList.find((item) => item.id === params.id) !== undefined ) {
                    // return res.status(400).json({status:"error", message: "already in cart" });
                // or if (dbResList.some( item => item.id === params.id)) {
                return res.status(400).json({ message: "already in cart" });

                } else {
                    updatedList.push(params.id);
                }

                //instert updated array in db
                Cart.updateOne(
                    { _id: listId },
                    {
                        $set: {
                            cartList: updatedList,
                        },
                    }
                )
                .then((dbRes) => {
                    res.status(200).json({ status:"ok", message: "added to cart" });
                })
                .catch((err) => {
                    console.log(err);
                });
            }
        })
        .catch((err) => console.log(err));
});

//* delete specific beat from cart 
router.post('/delete/:id', (req, res) => {
    //beat id in params.id
    const {user, params} = req;

    Cart.findOneAndUpdate(
        {userId: user.id},
        {$pull: {'cartList': params.id}}, {upsert: true}
    ).then( dbRes =>
        res.status(200).json({message: "deleted from cart"})
    ).catch( err =>
        console.log(err))
            
    // res.status(200).json({status:"ok", message:"deleted from cart"})
})

module.exports = router;
