var express = require("express");
var router = new express.Router();
const mongoose = require("mongoose");
const User = require("../models/Users");
const Favourite = require("../models/Favourites");

// * get favourites of specific user
router.get("/", (req, res) => {
    // deconstruc from req object to access variables globaly
    const { user, params } = req;
    //find user favourites depending on user id
    Favourite.findOne({ userId: { $eq: user.id } })
    // fetch from Beat collection and populate with matching ids
    .populate('favouriteList')
    .then((list) => {
        //check if user user already has a cart in db
        if (!list) {
            res.status(400).json({message: "no favourites"});
            
        } else {
            res.status(200).send(list) 
        }
    }).catch((err) => console.log(err))
});

//* add user favourites in favorites collection
router.post("/add/:id", (req, res) => {
    // deconstruct from req objet to access variables globaly
    const { user, params } = req;
    //find favourites in playlist collection depending on user id
    Favourite.findOne({ userId: user.id })
    .populate('favouriteList')
        .then(async (list) => {
            //check if user already has favourites collection in db
            if (!list) {
                const newFavourite = new Favourite({
                    userId: user.id,
                    favouriteList: params.id,
                });
                //if user doesnt have favourites collection
                //save the new favourite in database
                try {
                    const savedFavourite = await newFavourite.save()
                    .then( dbRes =>
                        User.findOneAndUpdate({_id: user.id}, {favourites: dbRes.id}, {upsert: true}),
                        res.status(200).json({status:"ok", message:"added to favourites"})
                    )
                } catch (err) {
                    res.status(400).send(err);
                }
            } else {
                //if collection already exists get the _id and favourites in collection
                //loop through it to check for duplicate before updating
                const listId = list.id;
                dbResList = list.favouriteList;
                const updatedList = [...dbResList];

                if ( dbResList.find( (item) => item.id === params.id) !== undefined) {
                    return res.status(400).json({ status:"error", message: "already liked" });
                } else {
                    updatedList.push(params.id);
                }

                //update db with updated array
                Favourite.updateOne(
                    { _id: listId },
                    {
                        $set: {
                            favouriteList: updatedList,
                        },
                    }
                )
                .then((dbRes) => {
                    res.status(200).json({status:"ok", message: "added to favourites" });
                })
                .catch((err) => {
                    console.log(err);
                });
            }
        })
        .catch((err) => console.log(err));
});

// * delete spacific beat from favourite list in db
router.post('/delete/:id', (req, res) => {
    const {user, params} = req;

    Favourite.findOneAndUpdate(
        {userId: user.id},
        {$pull: {'favouriteList': params.id}}, {new: true}
    ).then( dbRes =>
        res.status(200).json({status:"ok", message:"deleted from cart"})
    ).catch( err =>
        console.log(err))
            
})

module.exports = router;
